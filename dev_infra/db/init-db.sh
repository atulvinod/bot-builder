#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE bot_builder
EOSQL

psql -f /db-dumps/dump.sql bot_builder
