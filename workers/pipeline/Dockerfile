FROM python:3.12-slim
WORKDIR /app
COPY packages/geo_news /app/packages/geo_news
COPY workers/pipeline /app/workers/pipeline
RUN pip install --no-cache-dir /app/packages/geo_news /app/workers/pipeline
CMD ["python", "-m", "pipeline.main"]
