#!/bin/sh
set -e

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "SUPABASE_DB_URL is required to sync the local database." >&2
  exit 1
fi

LOCAL_DB_URL="${DATABASE_URL:-postgresql://bitskwela:bitskwela@db:5432/bitskwela}"

until pg_isready -h db -U bitskwela -d bitskwela; do
  sleep 1
done

psql "$LOCAL_DB_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"

DUMP_FILE="$(mktemp)"
if ! pg_dump --no-owner --no-acl "$SUPABASE_DB_URL" > "$DUMP_FILE"; then
  echo "pg_dump failed. Check SUPABASE_DB_URL and DNS connectivity." >&2
  rm -f "$DUMP_FILE"
  exit 1
fi

psql "$LOCAL_DB_URL" < "$DUMP_FILE"
rm -f "$DUMP_FILE"
