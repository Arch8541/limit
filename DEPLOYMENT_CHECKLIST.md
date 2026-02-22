# LIMIT Platform - Production Deployment Checklist

## Overview

This document provides a comprehensive checklist for deploying LIMIT to production on AWS.

---

## Pre-Deployment Requirements

### AWS Account Setup
- [ ] AWS Account with admin access
- [ ] AWS CLI installed and configured
- [ ] Billing alerts configured
- [ ] IAM user for CI/CD with appropriate permissions

### Domain & SSL
- [ ] Domain registered and DNS managed in Route 53
- [ ] SSL certificate requested in ACM (us-east-1 for CloudFront)
- [ ] Certificate validated via DNS

### GitHub Repository
- [ ] Repository secrets configured (see below)
- [ ] Branch protection rules enabled
- [ ] CI/CD workflow tested

---

## GitHub Secrets Required

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM user access key | `AKIAXXXXXXXXXX` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `ECR_REGISTRY` | ECR registry URL | `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `APP_RUNNER_SERVICE_ARN` | App Runner service ARN | `arn:aws:apprunner:us-east-1:...` |
| `DATABASE_URL` | Production PostgreSQL URL | `postgresql://user:pass@host:5432/db` |
| `APP_URL` | Production app URL | `https://limit.yourdomain.com` |

---

## Environment Variables (Production)

```env
# Database
DATABASE_URL="postgresql://limit_app:PASSWORD@limit-prod-db.xxxxx.us-east-1.rds.amazonaws.com:5432/limit_production?sslmode=require&connection_limit=5"

# Authentication
NEXTAUTH_URL="https://limit.yourdomain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
JWT_SECRET="<generate-with-openssl-rand-base64-32>"

# Email (Optional)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="LIMIT <noreply@yourdomain.com>"

# Runtime
NODE_ENV="production"
```

---

## Deployment Steps

### Phase 1: Database Setup
1. [ ] Create VPC with private subnets
2. [ ] Create RDS security group
3. [ ] Create RDS subnet group
4. [ ] Launch RDS PostgreSQL instance
5. [ ] Store credentials in Secrets Manager
6. [ ] Create application database user
7. [ ] Run Prisma migrations

### Phase 2: Container Registry
1. [ ] Create ECR repository
2. [ ] Enable image scanning
3. [ ] Configure lifecycle policies

### Phase 3: Application Deployment
1. [ ] Create IAM role for App Runner
2. [ ] Create VPC connector
3. [ ] Configure auto-scaling
4. [ ] Deploy App Runner service
5. [ ] Associate custom domain
6. [ ] Configure health checks

### Phase 4: DNS & SSL
1. [ ] Create Route 53 A/CNAME records
2. [ ] Verify SSL certificate
3. [ ] Test HTTPS access

### Phase 5: Monitoring
1. [ ] Create CloudWatch dashboard
2. [ ] Set up alarms (5xx errors, latency)
3. [ ] Configure SNS notifications
4. [ ] Enable Performance Insights on RDS

---

## Post-Deployment Verification

### Functional Tests
- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads with projects
- [ ] Create new project succeeds
- [ ] GDCR calculations work
- [ ] PDF report generation works
- [ ] User logout works

### Security Tests
- [ ] HTTPS enforced (HTTP redirects)
- [ ] Security headers present (check with securityheaders.com)
- [ ] No sensitive data in client logs
- [ ] Rate limiting works
- [ ] Session timeout works

### Performance Tests
- [ ] Page load time < 3s
- [ ] Time to First Byte (TTFB) < 200ms
- [ ] Lighthouse score > 80
- [ ] Database queries optimized

---

## Monitoring & Alerts

### CloudWatch Alarms
| Alarm | Metric | Threshold |
|-------|--------|-----------|
| High Error Rate | 5xxCount | > 10 in 5 min |
| High Latency | RequestLatency | > 2000ms p99 |
| Low Active Instances | ActiveInstances | < 1 |
| RDS CPU | CPUUtilization | > 80% |
| RDS Connections | DatabaseConnections | > 80% of max |

### Log Groups
- `/aws/apprunner/limit-production/service` - Application logs
- `/aws/rds/limit-prod-db` - Database logs

---

## Rollback Procedure

1. Identify the last working image tag
2. Update App Runner to previous image:
   ```bash
   aws apprunner update-service \
     --service-arn $SERVICE_ARN \
     --source-configuration '{
       "ImageRepository": {
         "ImageIdentifier": "ECR_URL:previous-tag"
       }
     }'
   ```
3. If database migration caused issues, restore from backup

---

## Cost Monitoring

### Expected Monthly Costs
| Service | Configuration | Est. Cost |
|---------|--------------|-----------|
| App Runner | 1 vCPU, 2GB RAM | $25-50 |
| RDS PostgreSQL | db.t3.medium, Multi-AZ | $80 |
| ECR | 10GB storage | $1 |
| Secrets Manager | 4 secrets | $2 |
| Route 53 | 1 hosted zone | $0.50 |
| CloudWatch | Logs + metrics | $5-10 |
| **Total** | | **~$115-145/month** |

---

## Support & Contacts

- **Technical Issues**: Check CloudWatch logs first
- **Security Incidents**: Immediately rotate all secrets
- **Database Issues**: Contact AWS RDS support

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-21 | 1.0.0 | Initial production deployment |
