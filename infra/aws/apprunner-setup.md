# AWS App Runner Deployment Guide for LIMIT

## Overview

This guide walks through deploying LIMIT to AWS App Runner with:
- ECR for container images
- RDS PostgreSQL for database
- Secrets Manager for credentials
- CloudWatch for monitoring
- Route 53 + ACM for custom domain

---

## Architecture

```
                                    ┌─────────────────┐
                                    │   Route 53      │
                                    │   (DNS)         │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   CloudFront    │
                                    │   (CDN/SSL)     │
                                    └────────┬────────┘
                                             │
┌─────────────────┐                ┌────────▼────────┐
│   GitHub        │ ──CI/CD──▶    │   App Runner    │
│   Repository    │                │   (Container)   │
└─────────────────┘                └────────┬────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│   ECR           │                │   Secrets       │                │   RDS           │
│   (Images)      │                │   Manager       │                │   (PostgreSQL)  │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

---

## Step 1: Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name limit \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=KMS \
  --region us-east-1

# Get repository URI
aws ecr describe-repositories \
  --repository-names limit \
  --query 'repositories[0].repositoryUri' \
  --output text
```

---

## Step 2: Create IAM Role for App Runner

```bash
# Create trust policy
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "build.apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name LimitAppRunnerECRRole \
  --assume-role-policy-document file://trust-policy.json

# Attach ECR policy
aws iam attach-role-policy \
  --role-name LimitAppRunnerECRRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
```

---

## Step 3: Store Secrets in AWS Secrets Manager

```bash
# Store database URL
aws secretsmanager create-secret \
  --name limit/production/DATABASE_URL \
  --secret-string "postgresql://limit_app:PASSWORD@limit-prod-db.xxxxx.us-east-1.rds.amazonaws.com:5432/limit_production?sslmode=require"

# Store NextAuth secrets
aws secretsmanager create-secret \
  --name limit/production/NEXTAUTH_SECRET \
  --secret-string "$(openssl rand -base64 32)"

aws secretsmanager create-secret \
  --name limit/production/JWT_SECRET \
  --secret-string "$(openssl rand -base64 32)"

# Store Resend API key
aws secretsmanager create-secret \
  --name limit/production/RESEND_API_KEY \
  --secret-string "re_xxxxxxxxxxxx"
```

---

## Step 4: Create VPC Connector (for RDS Access)

```bash
# Create VPC connector for App Runner to access RDS
aws apprunner create-vpc-connector \
  --vpc-connector-name limit-vpc-connector \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxxx
```

---

## Step 5: Create App Runner Service

```bash
# Create service configuration
cat > apprunner-config.json << 'EOF'
{
  "ServiceName": "limit-production",
  "SourceConfiguration": {
    "ImageRepository": {
      "ImageIdentifier": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/limit:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "3000",
        "RuntimeEnvironmentVariables": {
          "NODE_ENV": "production",
          "NEXTAUTH_URL": "https://limit.yourdomain.com"
        },
        "RuntimeEnvironmentSecrets": {
          "DATABASE_URL": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:limit/production/DATABASE_URL",
          "NEXTAUTH_SECRET": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:limit/production/NEXTAUTH_SECRET",
          "JWT_SECRET": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:limit/production/JWT_SECRET",
          "RESEND_API_KEY": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:limit/production/RESEND_API_KEY"
        }
      }
    },
    "AutoDeploymentsEnabled": true,
    "AuthenticationConfiguration": {
      "AccessRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/LimitAppRunnerECRRole"
    }
  },
  "InstanceConfiguration": {
    "Cpu": "1024",
    "Memory": "2048",
    "InstanceRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/LimitAppRunnerInstanceRole"
  },
  "AutoScalingConfigurationArn": "arn:aws:apprunner:us-east-1:YOUR_ACCOUNT_ID:autoscalingconfiguration/limit-autoscaling/1",
  "HealthCheckConfiguration": {
    "Protocol": "HTTP",
    "Path": "/api/health",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 1,
    "UnhealthyThreshold": 5
  },
  "NetworkConfiguration": {
    "EgressConfiguration": {
      "EgressType": "VPC",
      "VpcConnectorArn": "arn:aws:apprunner:us-east-1:YOUR_ACCOUNT_ID:vpcconnector/limit-vpc-connector/1"
    }
  }
}
EOF

# Create service
aws apprunner create-service --cli-input-json file://apprunner-config.json
```

---

## Step 6: Create Auto Scaling Configuration

```bash
aws apprunner create-auto-scaling-configuration \
  --auto-scaling-configuration-name limit-autoscaling \
  --max-concurrency 100 \
  --min-size 1 \
  --max-size 10
```

---

## Step 7: Set Up Custom Domain with Route 53 + ACM

### Request SSL Certificate

```bash
# Request certificate
aws acm request-certificate \
  --domain-name limit.yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# Note the certificate ARN
```

### Associate Custom Domain

```bash
# Get App Runner service ARN
SERVICE_ARN=$(aws apprunner list-services \
  --query "ServiceSummaryList[?ServiceName=='limit-production'].ServiceArn" \
  --output text)

# Associate domain
aws apprunner associate-custom-domain \
  --service-arn $SERVICE_ARN \
  --domain-name limit.yourdomain.com \
  --enable-www-subdomain
```

### Create Route 53 Records

```bash
# Get the DNS target from App Runner
DNS_TARGET=$(aws apprunner describe-custom-domains \
  --service-arn $SERVICE_ARN \
  --query 'CustomDomains[0].CertificateValidationRecords[0].Value' \
  --output text)

# Create A record (via Route 53 console or CLI)
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "limit.yourdomain.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "'$DNS_TARGET'"}]
      }
    }]
  }'
```

---

## Step 8: Set Up CloudWatch Monitoring

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name LimitProduction \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "title": "Request Count",
          "metrics": [
            ["AWS/AppRunner", "RequestCount", "ServiceName", "limit-production"]
          ],
          "period": 60
        }
      },
      {
        "type": "metric",
        "properties": {
          "title": "Response Latency",
          "metrics": [
            ["AWS/AppRunner", "RequestLatency", "ServiceName", "limit-production"]
          ],
          "period": 60
        }
      },
      {
        "type": "metric",
        "properties": {
          "title": "Active Instances",
          "metrics": [
            ["AWS/AppRunner", "ActiveInstances", "ServiceName", "limit-production"]
          ],
          "period": 60
        }
      }
    ]
  }'

# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name limit-high-error-rate \
  --metric-name 5xxCount \
  --namespace AWS/AppRunner \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:limit-alerts
```

---

## Estimated Monthly Costs

| Service | Configuration | Cost |
|---------|--------------|------|
| App Runner | 1 vCPU, 2GB RAM, avg 1 instance | ~$25/month |
| RDS PostgreSQL | db.t3.medium, Multi-AZ | ~$80/month |
| ECR | 10GB images | ~$1/month |
| Secrets Manager | 4 secrets | ~$2/month |
| Route 53 | 1 hosted zone + queries | ~$1/month |
| CloudWatch | Logs + metrics | ~$5/month |
| **Total** | | **~$115/month** |

---

## GitHub Actions Secrets Required

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `ECR_REGISTRY` | ECR registry URL |
| `APP_RUNNER_SERVICE_ARN` | App Runner service ARN |
| `DATABASE_URL` | PostgreSQL connection string |
| `APP_URL` | Production app URL |

---

## Troubleshooting

### View App Runner Logs

```bash
aws logs get-log-events \
  --log-group-name /aws/apprunner/limit-production/service \
  --log-stream-name application/latest
```

### Check Service Status

```bash
aws apprunner describe-service \
  --service-arn $SERVICE_ARN \
  --query 'Service.Status'
```

### Force Redeployment

```bash
aws apprunner start-deployment \
  --service-arn $SERVICE_ARN
```
