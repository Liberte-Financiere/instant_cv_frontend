# Étape 1 : Builder
FROM golang:1.21-alpine AS builder

# Installation des certificats SSL pour les requêtes HTTPS
RUN apk update && apk add --no-cache ca-certificates tzdata && update-ca-certificates

WORKDIR /app

# Initialisation d'un module Go basique
RUN go mod init cron_service

COPY main.go .

# Compilation statique du binaire
# CGO_ENABLED=0 garantit l'absence de dépendances à la libc locale
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o cron_service main.go

# Étape 2 : Runtime final ultra-léger (scratch)
FROM scratch

# On copie les certificats SSL depuis le builder
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# On copie les données de timezone (optionnel mais recommandé pour les logs temporels)
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# On copie notre binaire
COPY --from=builder /app/cron_service /cron_service

# Le conteneur s'exécute directement sur ce binaire
ENTRYPOINT ["/cron_service"]
