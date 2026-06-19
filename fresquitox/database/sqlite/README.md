# Fresquitox — SQLite (VPS Digital Ocean)

Base de datos embebida: **un solo archivo** `data/fresquitox.db`. No requiere instalar PostgreSQL ni MySQL.

## Cómo funciona

```
Cliente (QR mesa / admin)
        ↓
   Express SSR (server.ts)
        ↓
   /api/*  →  better-sqlite3  →  data/fresquitox.db
```

La BD se crea automáticamente al arrancar el servidor si no existe.

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `FRESQUITOX_DB_PATH` | `./data/fresquitox.db` | Ruta del archivo SQLite |
| `PORT` | `4000` | Puerto del servidor |

## Desarrollo local con API

### Opción A — Todo en uno (recomendado)

```bash
cd fresquitox
npm install --prefix frontend
npm run start:dev
```

Levanta la API en `:4001` y Angular en `:4200` con proxy a `/api`.

También puedes trabajar desde `fresquitox/frontend` con los mismos comandos.

### Opción B — SSR (producción local)

```bash
npm run build -- --configuration development
npm run serve:ssr:frontend
```

Abre `http://localhost:4000` — pedidos, productos y admin usan la BD.

### Solo API (otro terminal)

```bash
npm run dev:api
# GET http://localhost:4001/api/health
```

## Deploy en Digital Ocean

```bash
# En el VPS (Ubuntu)
sudo apt update && sudo apt install -y build-essential  # para compilar better-sqlite3

cd /var/www/fresquitox/frontend
npm ci
npm run build

# PM2
npm install -g pm2
FRESQUITOX_DB_PATH=/var/www/fresquitox/data/fresquitox.db pm2 start dist/frontend/server/server.mjs --name fresquitox
pm2 save
```

**Backup diario** (cron):

```bash
cp /var/www/fresquitox/data/fresquitox.db /var/backups/fresquitox-$(date +%F).db
```

## API disponible

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/productos` | Catálogo admin |
| GET | `/api/productos/activos` | Mesa QR |
| POST | `/api/pedidos` | Nuevo pedido mesa |
| PATCH | `/api/pedidos/:id/estado` | Kanban admin |
| GET | `/api/eventos` | Página eventos |
| GET | `/api/movimientos` | Reportes |
| GET | `/api/health` | Health check |

## PostgreSQL vs SQLite

En `../` tienes el esquema PostgreSQL por si más adelante escalas.  
Para un VPS con pocos pedidos, **SQLite es suficiente**.
