FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	UV_LINK_MODE=copy \
	UV_PROJECT_ENVIRONMENT=/app/backend/.venv \
	PATH="/app/backend/.venv/bin:$PATH"

WORKDIR /app/backend

RUN apt-get update \
	&& apt-get install --no-install-recommends -y build-essential libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.10.2 /uv /uvx /bin/

COPY pyproject.toml uv.lock README.md ./
COPY django_app/ ./django_app/
COPY entrypoint.sh ./entrypoint.sh

RUN uv sync --frozen --no-dev \
	&& chmod +x /app/backend/entrypoint.sh

EXPOSE 1400

ENTRYPOINT ["/app/backend/entrypoint.sh"]
