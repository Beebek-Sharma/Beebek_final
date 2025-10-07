#!/bin/bash

# Script to deploy the application to production

echo "Building frontend..."
cd ../frontend
npm run build

echo "Collecting static files..."
cd ../backend
python manage.py collectstatic --noinput

echo "Applying migrations..."
python manage.py migrate

echo "Starting Django with production settings..."
export DJANGO_ENV=production
gunicorn backend.wsgi:application --bind 0.0.0.0:8000

echo "Deployment complete!"