SHELL := /bin/bash

local:
	./scripts/run-local.sh

check:
	cd frontend && npm run lint && npm run typecheck && npm run build
	cd backend/django_app && if [ -x .venv/bin/python ]; then .venv/bin/python manage.py test; elif command -v uv >/dev/null 2>&1; then uv run python manage.py test; else python3 manage.py test; fi
