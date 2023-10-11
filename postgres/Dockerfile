# Use a specific version of the Postgres image
FROM postgres:13

# Install necessary packages and set up locale
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y wget build-essential postgresql-server-dev-13 locales && \
    echo "LC_ALL=en_US.UTF-8" >> /etc/environment && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    echo "LANG=en_US.UTF-8" > /etc/locale.conf && \
    locale-gen en_US.UTF-8 && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for locale
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Install pgvector
RUN wget https://github.com/pgvector/pgvector/archive/v0.4.4.tar.gz && \
    tar -xzvf v0.4.4.tar.gz && \
    cd pgvector-0.4.4 && \
    make && \
    make install

COPY ./init.sql /docker-entrypoint-initdb.d/