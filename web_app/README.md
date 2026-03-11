# web_app

Веб-приложение: Django + Next.js с production-контуром через Docker Compose, PostgreSQL и Nginx.

## Структура

- backend/django_app — Django проект
- frontend — Next.js фронтенд
- infra/nginx — reverse proxy и раздача static
- docker-compose.prod.yml — production stack
- .env.prod.example — шаблон production-переменных

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
