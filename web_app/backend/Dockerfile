FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1

WORKDIR /app/backend

RUN apt-get update \
	&& apt-get install --no-install-recommends -y build-essential libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md ./
COPY django_app/ ./django_app/
COPY entrypoint.sh ./entrypoint.sh

RUN pip install . \
	&& chmod +x /app/backend/entrypoint.sh

EXPOSE 1400

ENTRYPOINT ["/app/backend/entrypoint.sh"]
