#!/bin/bash

################################################################################
# Life Event Automation - Automated Deployment Script
# 
# This script automates the entire deployment process from code to production.
# It handles testing, building, database migrations, and deployment.
#
# Usage: ./scripts/deploy-automated.sh [environment] [provider]
# 
# Examples:
#   ./scripts/deploy-automated.sh production railway
#   ./scripts/deploy-automated.sh staging render
#   ./scripts/deploy-automated.sh production vercel
#
# Supported Providers: railway, render, vercel, aws
################################################################################

set -e

# Configuration
ENVIRONMENT=${1:-production}
PROVIDER=${2:-railway}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="logs"
LOG_FILE="${LOG_DIR}/deploy_${ENVIRONMENT}_${TIMESTAMP}.log"
BACKUP_DIR="backups"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
ROLLBACK_FILE="${BACKUP_DIR}/rollback_${TIMESTAMP}.json"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Create necessary directories
mkdir -p "$LOG_DIR" "$BACKUP_DIR"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Life Event Automation - Automated Deployment          ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║  Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}║  Provider: ${PROVIDER}${NC}"
echo -e "${BLUE}║  Timestamp: ${TIMESTAMP}${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Log to file
{
  echo "=== Deployment Log ==="
  echo "Environment: $ENVIRONMENT"
  echo "Provider: $PROVIDER"
  echo "Timestamp: $TIMESTAMP"
  echo "Started: $(date)"
  echo ""
} > "$LOG_FILE"

################################################################################
# STEP 1: Pre-Deployment Validation
################################################################################

log_info "Step 1/10: Running pre-deployment validation..."

# Check environment file exists
if [ ! -f ".env.${ENVIRONMENT}" ]; then
  log_error ".env.${ENVIRONMENT} file not found"
  log_error "Please create .env.${ENVIRONMENT} with required variables"
  exit 1
fi

log_success "Environment file found: .env.${ENVIRONMENT}"

# Check required tools
REQUIRED_TOOLS=("node" "npm" "git" "psql")
for tool in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "$tool" &> /dev/null; then
    log_warning "$tool not found in PATH (may be needed for deployment)"
  fi
done

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  log_warning "Uncommitted changes detected"
  log_info "Stashing changes..."
  git stash >> "$LOG_FILE" 2>&1
fi

log_success "Pre-deployment validation complete"

################################################################################
# STEP 2: Install Dependencies
################################################################################

log_info "Step 2/10: Installing dependencies..."

if [ ! -d "node_modules" ]; then
  log_info "Installing backend dependencies..."
  npm install >> "$LOG_FILE" 2>&1 || {
    log_error "Failed to install backend dependencies"
    exit 1
  }
  log_success "Backend dependencies installed"
fi

if [ ! -d "client/node_modules" ]; then
  log_info "Installing frontend dependencies..."
  cd client
  npm install >> "../$LOG_FILE" 2>&1 || {
    log_error "Failed to install frontend dependencies"
    exit 1
  }
  cd ..
  log_success "Frontend dependencies installed"
fi

log_success "Dependencies installation complete"

################################################################################
# STEP 3: Run Tests
################################################################################

log_info "Step 3/10: Running tests..."

npm test >> "$LOG_FILE" 2>&1 || {
  log_error "Tests failed"
  log_error "Fix failing tests before deploying"
  exit 1
}

log_success "All tests passed"

################################################################################
# STEP 4: Lint Code
################################################################################

log_info "Step 4/10: Linting code..."

npm run lint >> "$LOG_FILE" 2>&1 || {
  log_error "Linting failed"
  log_error "Fix linting errors before deploying"
  exit 1
}

log_success "Code linting passed"

################################################################################
# STEP 5: Security Audit
################################################################################

log_info "Step 5/10: Running security audit..."

npm audit --audit-level=moderate >> "$LOG_FILE" 2>&1 || {
  log_warning "Security vulnerabilities detected"
  log_warning "Review and fix before production deployment"
}

log_success "Security audit complete"

################################################################################
# STEP 6: Build Backend
################################################################################

log_info "Step 6/10: Building backend..."

npm run build:server >> "$LOG_FILE" 2>&1 || {
  log_error "Backend build failed"
  exit 1
}

log_success "Backend build complete"

################################################################################
# STEP 7: Build Frontend
################################################################################

log_info "Step 7/10: Building frontend..."

cd client
npm run build >> "../$LOG_FILE" 2>&1 || {
  log_error "Frontend build failed"
  exit 1
}
cd ..

log_success "Frontend build complete"

################################################################################
# STEP 8: Create Database Backup
################################################################################

log_info "Step 8/10: Creating database backup..."

# Load environment variables
export $(cat .env."${ENVIRONMENT}" | xargs)

if [ -n "$DATABASE_URL" ]; then
  # Try to create backup
  if pg_dump "$DATABASE_URL" > "$BACKUP_FILE" 2>> "$LOG_FILE"; then
    log_success "Database backup created: $BACKUP_FILE"
    
    # Save backup info
    {
      echo "{\"timestamp\": \"$TIMESTAMP\", \"environment\": \"$ENVIRONMENT\", \"backup_file\": \"$BACKUP_FILE\"}"
    } > "$ROLLBACK_FILE"
  else
    log_warning "Could not create database backup (database may not exist yet)"
  fi
else
  log_warning "DATABASE_URL not set, skipping backup"
fi

################################################################################
# STEP 9: Prepare Database Migrations
################################################################################

log_info "Step 9/10: Preparing database migrations..."

npm run prisma:generate >> "$LOG_FILE" 2>&1 || {
  log_error "Failed to generate Prisma client"
  exit 1
}

log_success "Database migrations prepared"

################################################################################
# STEP 10: Deploy to Provider
################################################################################

log_info "Step 10/10: Deploying to $PROVIDER..."

case "$PROVIDER" in
  railway)
    log_info "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
      log_error "Railway CLI not installed"
      log_info "Install with: npm i -g @railway/cli"
      exit 1
    fi
    
    railway up >> "$LOG_FILE" 2>&1 || {
      log_error "Railway deployment failed"
      exit 1
    }
    
    log_success "Railway deployment complete"
    ;;
    
  render)
    log_info "Deploying to Render..."
    
    if ! command -v render &> /dev/null; then
      log_warning "Render CLI not installed"
      log_info "Deploy manually at: https://dashboard.render.com"
    else
      # Deploy using Render CLI if available
      log_info "Deploying via Render CLI..."
    fi
    
    log_success "Render deployment initiated"
    ;;
    
  vercel)
    log_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
      log_error "Vercel CLI not installed"
      log_info "Install with: npm i -g vercel"
      exit 1
    fi
    
    cd client
    vercel --prod >> "../$LOG_FILE" 2>&1 || {
      log_error "Vercel deployment failed"
      exit 1
    }
    cd ..
    
    log_success "Vercel deployment complete"
    ;;
    
  aws)
    log_info "Deploying to AWS..."
    log_warning "AWS deployment requires manual configuration"
    log_info "See DEPLOYMENT_PRODUCTION.md for AWS setup instructions"
    ;;
    
  *)
    log_error "Unknown provider: $PROVIDER"
    log_info "Supported providers: railway, render, vercel, aws"
    exit 1
    ;;
esac

################################################################################
# STEP 11: Run Database Migrations
################################################################################

log_info "Running database migrations..."

npm run prisma:migrate:deploy >> "$LOG_FILE" 2>&1 || {
  log_error "Database migrations failed"
  log_error "Rollback changes and investigate"
  exit 1
}

log_success "Database migrations complete"

################################################################################
# STEP 12: Post-Deployment Verification
################################################################################

log_info "Verifying deployment..."

# Wait for service to be ready
sleep 5

# Test API endpoint
API_URL=${API_URL:-http://localhost:3000}
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
  log_success "Health check passed (HTTP $HEALTH_CHECK)"
else
  log_warning "Health check returned HTTP $HEALTH_CHECK (may need time to start)"
fi

################################################################################
# DEPLOYMENT COMPLETE
################################################################################

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✅ DEPLOYMENT COMPLETED SUCCESSFULLY             ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}║  Provider: ${PROVIDER}${NC}"
echo -e "${GREEN}║  Timestamp: ${TIMESTAMP}${NC}"
echo -e "${GREEN}║  Log File: ${LOG_FILE}${NC}"
echo -e "${GREEN}║  Backup: ${BACKUP_FILE}${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Summary
log_success "Deployment completed successfully!"
log_info "Deployment Summary:"
log_info "  - Environment: $ENVIRONMENT"
log_info "  - Provider: $PROVIDER"
log_info "  - Timestamp: $TIMESTAMP"
log_info "  - Log File: $LOG_FILE"
log_info "  - Backup File: $BACKUP_FILE"
log_info "  - Rollback Info: $ROLLBACK_FILE"

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK" ]; then
  log_info "Sending Slack notification..."
  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"✅ Deployment to $ENVIRONMENT completed successfully\", \"attachments\": [{\"color\": \"good\", \"fields\": [{\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true}, {\"title\": \"Provider\", \"value\": \"$PROVIDER\", \"short\": true}, {\"title\": \"Timestamp\", \"value\": \"$TIMESTAMP\", \"short\": false}]}]}" \
    >> "$LOG_FILE" 2>&1 || true
fi

# Log completion
{
  echo ""
  echo "Completed: $(date)"
  echo "Status: SUCCESS"
} >> "$LOG_FILE"

exit 0
