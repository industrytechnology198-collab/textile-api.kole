# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.12.0 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY prisma ./prisma/

RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" yarn install --immutable

COPY . .

RUN yarn build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.12.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" yarn install --immutable
COPY --from=builder /app/dist ./dist
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 4873
# cmd ["node", "dist/main.js"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

