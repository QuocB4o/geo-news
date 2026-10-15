FROM python:3.12-slim
WORKDIR /app
COPY packages/geo_news /app/packages/geo_news
COPY apps/api /app/apps/api
RUN pip install --no-cache-dir /app/packages/geo_news /app/apps/api
WORKDIR /app/apps/api
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
