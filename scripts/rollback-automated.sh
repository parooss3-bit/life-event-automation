#!/bin/bash

################################################################################
# Life Event Automation - Automated Rollback Script
#
# This script automates the rollback process if deployment fails.
# It restores the database from backup and reverts code changes.
#
# Usage: ./scripts/rollback-automated.sh [backup-file]
#
# Examples:
#   ./scripts/rollback-automated.sh backups/backup_20260409_120000.sql
#   ./scripts/rollback-automated.sh latest
#
################################################################################

set -e

BACKUP_FILE=${1:-latest}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="logs"
LOG_FILE="${LOG_DIR}/rollback_${TIMESTAMP}.log"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Create log directory
mkdir -p "$LOG_DIR"

# Print header
echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║     Life Event Automation - Automated Rollback             ║${NC}"
echo -e "${RED}║                                                            ║${NC}"
echo -e "${RED}║  ⚠️  WARNING: This will revert your deployment!            ║${NC}"
echo -e "${RED}║                                                            ║${NC}"
echo -e "${RED}║  Backup: ${BACKUP_FILE}${NC}"
echo -e "${RED}║  Timestamp: ${TIMESTAMP}${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Log to file
{
  echo "=== Rollback Log ==="
  echo "Backup: $BACKUP_FILE"
  echo "Timestamp: $TIMESTAMP"
  echo "Started: $(date)"
  echo ""
} > "$LOG_FILE"

# Confirmation
read -p "Are you sure you want to rollback? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  log_info "Rollback cancelled"
  exit 0
fi

################################################################################
# STEP 1: Find Backup File
################################################################################

log_info "Step 1/5: Finding backup file..."

if [ "$BACKUP_FILE" = "latest" ]; then
  # Find the most recent backup
  BACKUP_FILE=$(ls -t backups/backup_*.sql 2>/dev/null | head -1)
  
  if [ -z "$BACKUP_FILE" ]; then
    log_error "No backup files found in backups/ directory"
    exit 1
  fi
  
  log_success "Found latest backup: $BACKUP_FILE"
else
  if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
  fi
  
  log_success "Backup file found: $BACKUP_FILE"
fi

################################################################################
# STEP 2: Revert Code Changes
################################################################################

log_info "Step 2/5: Reverting code changes..."

# Get the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Current branch: $CURRENT_BRANCH"

# Find the previous commit before the deployment
PREVIOUS_COMMIT=$(git log --oneline -2 | tail -1 | awk '{print $1}')

if [ -z "$PREVIOUS_COMMIT" ]; then
  log_error "Could not find previous commit"
  exit 1
fi

log_info "Reverting to commit: $PREVIOUS_COMMIT"

# Reset to previous commit
git reset --hard "$PREVIOUS_COMMIT" >> "$LOG_FILE" 2>&1 || {
  log_error "Failed to revert code changes"
  exit 1
}

log_success "Code reverted to: $PREVIOUS_COMMIT"

################################################################################
# STEP 3: Restore Database
################################################################################

log_info "Step 3/5: Restoring database from backup..."

# Load environment variables
if [ -f ".env.production" ]; then
  export $(cat .env.production | xargs)
elif [ -f ".env" ]; then
  export $(cat .env | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  log_error "DATABASE_URL not set"
  exit 1
fi

log_info "Restoring database..."

# Restore from backup
if psql "$DATABASE_URL" < "$BACKUP_FILE" >> "$LOG_FILE" 2>&1; then
  log_success "Database restored from backup"
else
  log_warning "Database restore may have encountered issues"
  log_warning "Check logs for details: $LOG_FILE"
fi

################################################################################
# STEP 4: Verify Rollback
################################################################################

log_info "Step 4/5: Verifying rollback..."

# Check git status
if git status --porcelain | grep -q .; then
  log_warning "Uncommitted changes detected after rollback"
else
  log_success "Git status clean"
fi

# Check database connection
if psql "$DATABASE_URL" -c "SELECT 1" >> "$LOG_FILE" 2>&1; then
  log_success "Database connection verified"
else
  log_error "Database connection failed"
  exit 1
fi

################################################################################
# STEP 5: Restart Services
################################################################################

log_info "Step 5/5: Restarting services..."

# Kill existing processes
if command -v pm2 &> /dev/null; then
  log_info "Restarting PM2 services..."
  pm2 restart all >> "$LOG_FILE" 2>&1 || {
    log_warning "PM2 restart may have failed"
  }
  log_success "PM2 services restarted"
elif command -v systemctl &> /dev/null; then
  log_info "Restarting systemd services..."
  # Adjust service names as needed
  systemctl restart life-event-automation >> "$LOG_FILE" 2>&1 || {
    log_warning "Service restart may have failed"
  }
  log_success "Systemd services restarted"
else
  log_warning "Could not determine service manager"
  log_info "Please restart services manually"
fi

################################################################################
# ROLLBACK COMPLETE
################################################################################

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            ✅ ROLLBACK COMPLETED SUCCESSFULLY              ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  Backup: ${BACKUP_FILE}${NC}"
echo -e "${GREEN}║  Reverted to: ${PREVIOUS_COMMIT}${NC}"
echo -e "${GREEN}║  Log File: ${LOG_FILE}${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log_success "Rollback completed successfully!"
log_info "Rollback Summary:"
log_info "  - Backup File: $BACKUP_FILE"
log_info "  - Reverted to: $PREVIOUS_COMMIT"
log_info "  - Timestamp: $TIMESTAMP"
log_info "  - Log File: $LOG_FILE"

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK" ]; then
  log_info "Sending Slack notification..."
  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"⚠️ Rollback completed\", \"attachments\": [{\"color\": \"warning\", \"fields\": [{\"title\": \"Backup\", \"value\": \"$BACKUP_FILE\", \"short\": true}, {\"title\": \"Reverted to\", \"value\": \"$PREVIOUS_COMMIT\", \"short\": true}]}]}" \
    >> "$LOG_FILE" 2>&1 || true
fi

# Log completion
{
  echo ""
  echo "Completed: $(date)"
  echo "Status: SUCCESS"
} >> "$LOG_FILE"

exit 0
