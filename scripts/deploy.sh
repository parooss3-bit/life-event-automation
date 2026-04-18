#!/bin/bash

# Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="logs/deploy_${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p logs

echo -e "${YELLOW}Starting deployment to ${ENVIRONMENT}...${NC}" | tee -a "$LOG_FILE"

# Step 1: Pre-deployment checks
echo -e "${YELLOW}Step 1: Running pre-deployment checks...${NC}" | tee -a "$LOG_FILE"

if [ ! -f ".env.${ENVIRONMENT}" ]; then
  echo -e "${RED}Error: .env.${ENVIRONMENT} file not found${NC}" | tee -a "$LOG_FILE"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}" | tee -a "$LOG_FILE"
  npm install >> "$LOG_FILE" 2>&1
fi

# Step 2: Run tests
echo -e "${YELLOW}Step 2: Running tests...${NC}" | tee -a "$LOG_FILE"
npm test >> "$LOG_FILE" 2>&1 || {
  echo -e "${RED}Tests failed${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Step 3: Lint code
echo -e "${YELLOW}Step 3: Linting code...${NC}" | tee -a "$LOG_FILE"
npm run lint >> "$LOG_FILE" 2>&1 || {
  echo -e "${RED}Linting failed${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Step 4: Build backend
echo -e "${YELLOW}Step 4: Building backend...${NC}" | tee -a "$LOG_FILE"
npm run build:server >> "$LOG_FILE" 2>&1 || {
  echo -e "${RED}Backend build failed${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Step 5: Build frontend
echo -e "${YELLOW}Step 5: Building frontend...${NC}" | tee -a "$LOG_FILE"
cd client
npm run build >> "../$LOG_FILE" 2>&1 || {
  echo -e "${RED}Frontend build failed${NC}" | tee -a "../$LOG_FILE"
  exit 1
}
cd ..

# Step 6: Security audit
echo -e "${YELLOW}Step 6: Running security audit...${NC}" | tee -a "$LOG_FILE"
npm audit --audit-level=moderate >> "$LOG_FILE" 2>&1 || {
  echo -e "${RED}Security vulnerabilities found${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Step 7: Database migrations
echo -e "${YELLOW}Step 7: Preparing database migrations...${NC}" | tee -a "$LOG_FILE"
npm run prisma:generate >> "$LOG_FILE" 2>&1

# Step 8: Create backup
echo -e "${YELLOW}Step 8: Creating backup...${NC}" | tee -a "$LOG_FILE"
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql"
mkdir -p backups

if [ -n "$DATABASE_URL" ]; then
  # Extract database credentials from DATABASE_URL
  # Format: postgresql://user:password@host:port/dbname
  pg_dump "$DATABASE_URL" > "$BACKUP_FILE" 2>> "$LOG_FILE" || {
    echo -e "${YELLOW}Warning: Could not create database backup${NC}" | tee -a "$LOG_FILE"
  }
  echo -e "${GREEN}Backup created: $BACKUP_FILE${NC}" | tee -a "$LOG_FILE"
fi

# Step 9: Deploy
echo -e "${YELLOW}Step 9: Deploying...${NC}" | tee -a "$LOG_FILE"

case "$ENVIRONMENT" in
  production)
    echo -e "${YELLOW}Deploying to production...${NC}" | tee -a "$LOG_FILE"
    # Deploy to production
    # Example: vercel --prod
    # Or: railway up
    # Or: your custom deployment script
    ;;
  staging)
    echo -e "${YELLOW}Deploying to staging...${NC}" | tee -a "$LOG_FILE"
    # Deploy to staging
    ;;
  *)
    echo -e "${RED}Unknown environment: $ENVIRONMENT${NC}" | tee -a "$LOG_FILE"
    exit 1
    ;;
esac

# Step 10: Post-deployment verification
echo -e "${YELLOW}Step 10: Verifying deployment...${NC}" | tee -a "$LOG_FILE"

# Wait for service to be ready
sleep 5

# Test API endpoint
API_URL=${API_URL:-http://localhost:3000}
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
  echo -e "${GREEN}Health check passed${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${RED}Health check failed (HTTP $HEALTH_CHECK)${NC}" | tee -a "$LOG_FILE"
  exit 1
fi

# Step 11: Run migrations
echo -e "${YELLOW}Step 11: Running database migrations...${NC}" | tee -a "$LOG_FILE"
npm run prisma:migrate:deploy >> "$LOG_FILE" 2>&1 || {
  echo -e "${RED}Database migrations failed${NC}" | tee -a "$LOG_FILE"
  exit 1
}

# Success
echo -e "${GREEN}Deployment completed successfully!${NC}" | tee -a "$LOG_FILE"
echo -e "${GREEN}Deployment log: $LOG_FILE${NC}"

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK" ]; then
  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"✅ Deployment to $ENVIRONMENT completed successfully\"}" \
    >> "$LOG_FILE" 2>&1 || true
fi

exit 0
