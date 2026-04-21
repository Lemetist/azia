# web_app

Веб-приложение: Django + Next.js с production-контуром через Docker Compose, PostgreSQL и Nginx.

## Структура

- backend/django_app — Django проект
- frontend — Next.js фронтенд
- infra/nginx — reverse proxy и раздача static
- docker-compose.prod.yml — production stack
- .env.prod.example — шаблон production-переменных

## Локальный запуск

Для локального тестирования удобнее запускать frontend и backend одной командой:

```bash
make local
```

Если `make` не нужен, можно запустить напрямую:

```bash
./scripts/run-local.sh
```

Что делает скрипт:

- создает `frontend/.env.local` из шаблона, если файла еще нет
- при необходимости ставит frontend-зависимости через `npm ci`
- применяет Django-миграции
- поднимает Django на `127.0.0.1:8000`
- поднимает Next.js на `127.0.0.1:3000`
- завершает оба процесса по `Ctrl+C`

Проверка проекта перед ручным тестом:

```bash
make check
```

## Production запуск

1. Создайте файл .env.prod на основе .env.prod.example.
2. Проверьте домены в DJANGO_ALLOWED_HOSTS и DJANGO_CSRF_TRUSTED_ORIGINS.
3. Запустите стек:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

4. Проверка после старта:

```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost/health/
```

## Что делает production-контур

- backend запускается через gunicorn
- при старте автоматически применяются миграции и collectstatic
- nginx проксирует / в Next.js, /api и /admin в Django
- статические файлы Django раздаются напрямую из nginx
