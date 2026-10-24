FROM python:3.9-slim-bookworm

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir fastapi uvicorn redis requests openai langchain langchain-community langchain-openai python-dotenv postgres psycopg2-binary pgvector

# install postgresql client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Make wait-for-postgres.sh executable
RUN chmod +x /app/wait-for-postgres.sh

EXPOSE 80

CMD ["/bin/sh", "-c", "/app/wait-for-postgres.sh postgres uvicorn app:app --host 0.0.0.0 --port 80"]
