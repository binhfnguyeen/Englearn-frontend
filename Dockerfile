##### Dockerfile #####
FROM node:22.14-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy toàn bộ file lock và workspace config
COPY package.json pnpm-lock.yaml ./

# Force install with ignore-scripts để tránh lỗi build native deps
RUN pnpm install --frozen-lockfile --ignore-scripts


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
