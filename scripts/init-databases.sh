#!/bin/bash

# Script para inicializar las bases de datos con los modelos SQL

echo "Inicializando bases de datos..."

# Auth Service
echo "Creando base de datos auth_service..."
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE auth_service;" 2>/dev/null || echo "Base de datos auth_service ya existe"
psql -U postgres -h localhost -p 5432 -d auth_service -f "../Modelos base de datos - Copy/auth_service.sql"

# Stalls Service
echo "Creando base de datos stalls_service..."
psql -U postgres -h localhost -p 5433 -c "CREATE DATABASE stalls_service;" 2>/dev/null || echo "Base de datos stalls_service ya existe"
psql -U postgres -h localhost -p 5433 -d stalls_service -f "../Modelos base de datos - Copy/stalls_service.sql"

# Products Service
echo "Creando base de datos products_service..."
psql -U postgres -h localhost -p 5434 -c "CREATE DATABASE products_service;" 2>/dev/null || echo "Base de datos products_service ya existe"
psql -U postgres -h localhost -p 5434 -d products_service -f "../Modelos base de datos - Copy/products_service.sql"

# Orders Service
echo "Creando base de datos orders_service..."
psql -U postgres -h localhost -p 5435 -c "CREATE DATABASE orders_service;" 2>/dev/null || echo "Base de datos orders_service ya existe"
psql -U postgres -h localhost -p 5435 -d orders_service -f "../Modelos base de datos - Copy/orders_service.sql"

echo "Bases de datos inicializadas correctamente!"

