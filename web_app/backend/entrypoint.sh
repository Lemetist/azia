#!/bin/sh
set -eu

cd /app/backend/django_app

uv run --project /app/backend python manage.py migrate --noinput
uv run --project /app/backend python manage.py collectstatic --noinput

exec uv run --project /app/backend gunicorn \
  --bind 0.0.0.0:1400 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout "${GUNICORN_TIMEOUT:-60}" \
  --access-logfile - \
  --error-logfile - \
  config.wsgi:application
