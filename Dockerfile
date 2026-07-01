FROM node:23-slim AS builder

WORKDIR /app

# Habilitar pnpm mediante corepack
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# No descargar el Chrome propio de Puppeteer: en producción usamos el Chromium
# del sistema (ver etapa de producción). Ahorra ~150MB y evita copiar el cache.
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Instalar dependencias (se ejecutará en el entorno Linux de la imagen, resolviendo los binarios nativos correctos)
RUN pnpm install --frozen-lockfile=false

# Copiar el código fuente
COPY . .

# Hacer el build de la aplicación SvelteKit
RUN pnpm run build

# Eliminar dependencias de desarrollo para aligerar la imagen de producción
RUN pnpm prune --prod

# -----------------------------------
# Etapa de producción
FROM node:23-slim

WORKDIR /app

# Chromium del sistema para la exportación de PDF etiquetado (headless).
# apt trae el navegador junto con todas sus librerías compartidas (libnss3, etc.).
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

# Copiar el build y las dependencias de producción desde la etapa anterior
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# SvelteKit adapter-node usa el puerto 3000 por defecto
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
# Puppeteer usa este binario en vez de descargar el suyo.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Iniciar la aplicación
CMD ["node", "build/index.js"]
