# Staging Environment Setup

This document explains how to deploy and manage staging environments for the Sanderfest application.

## Quick Start

### GitHub Actions Deployment
1. Go to Actions tab in GitHub
2. Select "Deploy to Staging" workflow
3. Click "Run workflow"
4. Enter staging number (1-10) and branch name
5. Access at `https://sander{staging_number}.imlostincode.nl`

## Architecture

- **Shared PostgreSQL**: One instance with separate databases per staging environment
- **Isolated Apps**: Each staging environment runs on its own port
- **URL Mapping**: Staging N accessible at `https://sanderN.imlostincode.nl`

## Files Created

- `docker-compose.staging.template.yml` - Template for staging environments
- `init-staging-dbs.sql` - PostgreSQL initialization script
- `.github/workflows/deploy-staging.yml` - GitHub Actions workflow
- `.env.staging.example` - Environment variables template

## Environment Variables

Each staging environment gets:
- `STAGING_ENV`: Environment number (1-10)
- `DB_NAME`: `staging_db_${STAGING_NUM}`
- `NODE_ENV`: staging
- URL: `https://sander${STAGING_NUM}.imlostincode.nl`

## Management Commands

```bash
# View logs for staging environment 5
docker-compose -f docker-compose.staging-5.yml logs -f

# Stop staging environment 5
docker-compose -f docker-compose.staging-5.yml down

# Restart staging environment 5
docker-compose -f docker-compose.staging-5.yml restart

# View all running containers
docker ps

# Clean up unused images
docker image prune -f
```

## Database Access

Each staging environment has its own database:
- Host: `postgres-staging` (from containers)
- **Databases are auto-created** when PostgreSQL starts via `init-staging-dbs.sql`
- Username: `staging_user`
- Password: `staging_pass`
- Database: `staging_db_1`, `staging_db_2`, etc.

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3005

# Stop the conflicting service or choose a different staging number
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres-staging

# View PostgreSQL logs
docker logs postgres-staging
```

### Application Won't Start
```bash
# Check application logs
docker-compose -f docker-compose.staging-5.yml logs app-staging-5

# Rebuild the image
docker-compose -f docker-compose.staging-5.yml build --no-cache
```