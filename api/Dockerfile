# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.19 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main

# TODO test stage

FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /app

COPY --from=build-stage /app/main /app/main
COPY --from=build-stage /app/.env.example /app/.env

EXPOSE 8080

USER nonroot:nonroot

CMD ["/app/main"]
