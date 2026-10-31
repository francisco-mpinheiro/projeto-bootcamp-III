#!/bin/sh
set -e

echo "Aguardando PostgreSQL e sincronizando schema..."

i=0
until npx prisma db push --skip-generate; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "PostgreSQL indisponivel apos 30 tentativas."
    exit 1
  fi
  echo "Banco ainda nao pronto (${i}/30). Nova tentativa em 2s..."
  sleep 2
done

echo "Schema sincronizado. Iniciando Stockly API..."
exec "$@"
