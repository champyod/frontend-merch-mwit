# Frontend-Merch-MWIT Dockerfile (MWIT-LINK Pattern)
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Copy lockfile and package.json
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Build the application
ARG API_URL=http://localhost:8080
ENV API_URL=$API_URL
RUN bun run build

# Runner stage
FROM oven/bun:1.1-alpine
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]