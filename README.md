# Library API (NestJS + TypeScript)

API de Libros SMPC

## Instalación local (Docker recomendado)
```bash
cp .env.example .env
docker compose up -d --build
# API: http://localhost:3000
# Swagger: http://localhost:3000/docs
```

### Crear usuario admin (seed)
```bash
docker exec -it api_library npm run seed
```

## Endpoints
- `POST /auth/login` → { email, password } → { access_token }
- `GET /books` (Bearer)
- `POST /books` (Bearer)
- `PATCH /books/:id` (Bearer)
- `DELETE /books/:id` (soft delete)
- `PATCH /books/:id/restore` (Bearer)
- `GET /books/export/csv` (Bearer)

## Testing
```bash
npm run test:cov   # cobertura >= 80%
```

## Arquitectura
- Swagger en `/docs`
