# Back-end API

## Installation

```bash
go get ./...
```

## Initialize database

### Local Postgres

Only working for macOs

```bash
createuser -d nft_test_api
createdb -U nft_test_api nft_test_api
psql -U nft_test_api -d nft_test_api -f ./db/schema.sql
```

### Docker Compose

```bash
docker-compose up db -d

docker-compose cp ./db/schema.sql db:/tmp/schema.sql
docker-compose exec db psql -U nft_test_api -d nft_test_api -f /tmp/schema.sql
```

## Run

### Local

```bash
cp .env.example .env

go run main.go
```

### Docker Compose

```bash
docker-compose up -d
```
