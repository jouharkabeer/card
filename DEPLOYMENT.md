# Deployment Guide - LSofito NFC Business Card Platform

## Production Domains
- **Frontend**: https://card.lsofito.com
- **Backend API**: https://api-card.lsofito.com
- **Database**: SQLite (db.sqlite3) - for now

## Backend Deployment

### 1. Environment Setup

Create a `.env` file in the `backend/` directory (copy from `backend/.env.example`):

```env
SECRET_KEY=your-very-secret-key-here-generate-with-django-secret-key-generator
DEBUG=False
ALLOWED_HOSTS=api-card.lsofito.com
CORS_ALLOWED_ORIGINS=https://card.lsofito.com
CORS_ALLOW_ALL_ORIGINS=False
DB_ENGINE=sqlite
SECURE_SSL_REDIRECT=True
```

**Important**: Generate a secure SECRET_KEY:
```bash
cd backend
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Run migrations
python manage.py migrate

# Create superuser (if not already created)
python manage.py createsuperuser
```

### 4. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 5. Run with Gunicorn

Install Gunicorn:
```bash
pip install gunicorn
```

Run with Gunicorn:
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### 6. Production Server Configuration (Nginx)

Create nginx configuration for `api-card.lsofito.com`:

```nginx
server {
    listen 80;
    server_name api-card.lsofito.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api-card.lsofito.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API location
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files (IMPORTANT: Update path to your actual backend directory)
    location /media/ {
        alias /path/to/backend/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        # Ensure media files are accessible
        access_log off;
    }

    # Static files
    location /static/ {
        alias /path/to/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7. Systemd Service (Optional)

Create `/etc/systemd/system/lsofitocard-api.service`:

```ini
[Unit]
Description=LSofito Card API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable lsofitocard-api
sudo systemctl start lsofitocard-api
```

## Frontend Deployment

### 1. Environment Setup

Create a `.env` file in the `frontend/` directory (copy from `frontend/.env.example`):

```env
VITE_API_URL=https://api-card.lsofito.com/api
```

**Note**: The environment variable must start with `VITE_` for Vite to include it in the build.

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### 4. Deploy to Web Server

#### Option A: Nginx (Recommended)

**Important**: Update `/path/to/frontend/dist` to your actual deployment path.

Configure nginx for `card.lsofito.com`:

```nginx
server {
    listen 80;
    server_name card.lsofito.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name card.lsofito.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    root /path/to/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Option B: Vercel/Netlify

1. Connect your repository
2. Set environment variable: `VITE_API_URL=https://api-card.lsofito.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

## Quick Start Commands

### Backend Production Setup
```bash
cd backend

# 1. Create .env file (see backend/.env.example)
cp .env.example .env
# Edit .env with production values

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Collect static files
python manage.py collectstatic --noinput

# 5. Create superuser (if needed)
python manage.py createsuperuser

# 6. Test with Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Frontend Production Setup
```bash
cd frontend

# 1. Create .env file (see frontend/.env.example)
cp .env.example .env
# Edit .env with: VITE_API_URL=https://api-card.lsofito.com/api

# 2. Install dependencies
npm install

# 3. Build for production
npm run build

# 4. Deploy dist/ folder to web server
```

## Verification Checklist

- [ ] Backend API is accessible at https://api-card.lsofito.com/api/
- [ ] Frontend is accessible at https://card.lsofito.com
- [ ] CORS is properly configured (frontend can access backend)
- [ ] SSL certificates are valid
- [ ] Media files are accessible (e.g., https://api-card.lsofito.com/media/profiles/...)
- [ ] Static files are served correctly
- [ ] DEBUG is set to False in production
- [ ] SECRET_KEY is secure and not the default
- [ ] Database migrations are applied
- [ ] Superuser account is created
- [ ] Frontend .env has correct API URL
- [ ] Backend .env has correct CORS origins

## Troubleshooting

### CORS Issues
- Check that `CORS_ALLOWED_ORIGINS` includes `https://card.lsofito.com`
- Verify the frontend is making requests to `https://api-card.lsofito.com/api`

### Media Files Not Loading
- Ensure nginx is configured to serve `/media/` directory
- Check file permissions on media directory
- Verify MEDIA_ROOT path in Django settings

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Verify STATIC_ROOT and STATIC_URL in settings
- Check nginx configuration for `/static/` location

### API Not Accessible
- Check ALLOWED_HOSTS includes `api-card.lsofito.com`
- Verify firewall rules allow traffic on port 8000 (or configured port)
- Check Gunicorn/systemd service is running

## Monitoring

### Check Backend Logs
```bash
# If using systemd
sudo journalctl -u lsofitocard-api -f

# If using Gunicorn directly
# Check your Gunicorn log file
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Database Backup (SQLite)

```bash
# Backup database
cp backend/db.sqlite3 backend/db.sqlite3.backup

# Or use a backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp backend/db.sqlite3 backend/backups/db_$DATE.sqlite3
```

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong SECRET_KEY** in production
3. **Keep DEBUG=False** in production
4. **Use HTTPS** for all production traffic
5. **Regularly update dependencies** for security patches
6. **Monitor logs** for suspicious activity
7. **Set up regular database backups**

## Next Steps (Optional)

- Set up PostgreSQL for better production performance
- Configure CDN for static/media files
- Set up monitoring (e.g., Sentry for error tracking)
- Configure automated backups
- Set up CI/CD pipeline

