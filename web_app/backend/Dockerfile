FROM python:3.13-slim

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python3","django_app/manage.py","runserver","0.0.0.0:8080"]
