# AWS RDS PostgreSQL Setup Guide for LIMIT

## Prerequisites
- AWS Account with admin access
- AWS CLI installed and configured
- VPC with private subnets ready

---

## Step 1: Create VPC & Subnets (if not exists)

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=limit-vpc}]'

# Note the VPC ID from output, e.g., vpc-xxxxxxxxx

# Create private subnets in 2 AZs (required for RDS)
aws ec2 create-subnet \
  --vpc-id vpc-xxxxxxxxx \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=limit-private-1a}]'

aws ec2 create-subnet \
  --vpc-id vpc-xxxxxxxxx \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=limit-private-1b}]'
```

---

## Step 2: Create RDS Security Group

```bash
# Create security group for RDS
aws ec2 create-security-group \
  --group-name limit-rds-sg \
  --description "Security group for LIMIT RDS PostgreSQL" \
  --vpc-id vpc-xxxxxxxxx

# Note the security group ID, e.g., sg-xxxxxxxxx

# Allow PostgreSQL access from within VPC only
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/16
```

---

## Step 3: Create RDS Subnet Group

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name limit-db-subnet-group \
  --db-subnet-group-description "Subnet group for LIMIT database" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy
```

---

## Step 4: Create RDS PostgreSQL Instance

### Production Configuration (Recommended)

```bash
aws rds create-db-instance \
  --db-instance-identifier limit-prod-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username limit_admin \
  --master-user-password "YOUR_SECURE_PASSWORD_HERE" \
  --allocated-storage 20 \
  --max-allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --kms-key-id alias/aws/rds \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name limit-db-subnet-group \
  --db-name limit_production \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --multi-az \
  --publicly-accessible false \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --deletion-protection \
  --tags Key=Environment,Value=production Key=Project,Value=limit
```

### Development Configuration (Cost-optimized)

```bash
aws rds create-db-instance \
  --db-instance-identifier limit-dev-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username limit_admin \
  --master-user-password "YOUR_DEV_PASSWORD_HERE" \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name limit-db-subnet-group \
  --db-name limit_development \
  --backup-retention-period 1 \
  --no-multi-az \
  --publicly-accessible false \
  --tags Key=Environment,Value=development Key=Project,Value=limit
```

---

## Step 5: Get Connection Endpoint

```bash
# Wait for instance to be available
aws rds wait db-instance-available --db-instance-identifier limit-prod-db

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier limit-prod-db \
  --query 'DBInstances[0].Endpoint.[Address,Port]' \
  --output text
```

---

## Step 6: Store Credentials in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name limit/production/database \
  --description "LIMIT production database credentials" \
  --secret-string '{
    "username": "limit_admin",
    "password": "YOUR_SECURE_PASSWORD_HERE",
    "engine": "postgres",
    "host": "limit-prod-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com",
    "port": 5432,
    "dbname": "limit_production"
  }'
```

---

## Step 7: Create Application Database User

Connect to database and create application user:

```sql
-- Connect via bastion host or AWS Session Manager
-- Then run these SQL commands:

-- Create application user
CREATE USER limit_app WITH PASSWORD 'app_user_password';

-- Grant permissions
GRANT CONNECT ON DATABASE limit_production TO limit_app;
GRANT USAGE ON SCHEMA public TO limit_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO limit_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO limit_app;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO limit_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO limit_app;
```

---

## Step 8: Configure Environment Variables

```env
# Production DATABASE_URL format
DATABASE_URL="postgresql://limit_app:app_user_password@limit-prod-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/limit_production?sslmode=require&connection_limit=5"

# For Prisma connection pooling (recommended for serverless)
DATABASE_URL="postgresql://limit_app:app_user_password@limit-prod-db.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com:5432/limit_production?sslmode=require&connection_limit=5&pool_timeout=10"
```

---

## Step 9: Run Prisma Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations on production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

## Estimated Costs (US East - N. Virginia)

| Configuration | Instance | Multi-AZ | Storage | Monthly Cost |
|--------------|----------|----------|---------|--------------|
| Development | db.t3.micro | No | 20GB gp2 | ~$15/month |
| Production | db.t3.medium | Yes | 20GB gp3 | ~$80/month |
| Scale-up | db.t3.large | Yes | 100GB gp3 | ~$200/month |

---

## Security Best Practices Checklist

- [x] Database in private subnet (no public access)
- [x] Security group limits access to VPC CIDR only
- [x] Encryption at rest enabled (KMS)
- [x] SSL/TLS required for connections (`sslmode=require`)
- [x] Separate application user (not master user)
- [x] Credentials stored in Secrets Manager
- [x] Automated backups enabled
- [x] Deletion protection enabled
- [x] Performance Insights enabled for monitoring
