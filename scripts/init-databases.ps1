# Script PowerShell para inicializar las bases de datos con los modelos SQL

Write-Host "Inicializando bases de datos..." -ForegroundColor Green

# Configuración
$env:PGPASSWORD = "postgres"
$host = "localhost"

# Auth Service
Write-Host "Creando base de datos auth_service..." -ForegroundColor Yellow
psql -U postgres -h $host -p 5432 -c "CREATE DATABASE auth_service;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Base de datos auth_service ya existe" -ForegroundColor Gray
}
Get-Content "..\Modelos base de datos - Copy\auth_service.sql" | psql -U postgres -h $host -p 5432 -d auth_service

# Stalls Service
Write-Host "Creando base de datos stalls_service..." -ForegroundColor Yellow
psql -U postgres -h $host -p 5433 -c "CREATE DATABASE stalls_service;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Base de datos stalls_service ya existe" -ForegroundColor Gray
}
Get-Content "..\Modelos base de datos - Copy\stalls_service.sql" | psql -U postgres -h $host -p 5433 -d stalls_service

# Products Service
Write-Host "Creando base de datos products_service..." -ForegroundColor Yellow
psql -U postgres -h $host -p 5434 -c "CREATE DATABASE products_service;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Base de datos products_service ya existe" -ForegroundColor Gray
}
Get-Content "..\Modelos base de datos - Copy\products_service.sql" | psql -U postgres -h $host -p 5434 -d products_service

# Orders Service
Write-Host "Creando base de datos orders_service..." -ForegroundColor Yellow
psql -U postgres -h $host -p 5435 -c "CREATE DATABASE orders_service;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Base de datos orders_service ya existe" -ForegroundColor Gray
}
Get-Content "..\Modelos base de datos - Copy\orders_service.sql" | psql -U postgres -h $host -p 5435 -d orders_service

Write-Host "Bases de datos inicializadas correctamente!" -ForegroundColor Green

