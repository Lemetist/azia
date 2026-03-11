#!/bin/sh
set -eu

cd /app/backend/django_app

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn \
  --bind 0.0.0.0:1400 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout "${GUNICORN_TIMEOUT:-60}" \
  --access-logfile - \
  --error-logfile - \
  config.wsgi:application