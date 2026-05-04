FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_API_BASE=/api
ARG NEXT_PUBLIC_ENABLE_FIGMA_CAPTURE=false
ARG API_PROXY_TARGET=http://127.0.0.1:8000

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_ENABLE_FIGMA_CAPTURE=${NEXT_PUBLIC_ENABLE_FIGMA_CAPTURE}
ENV API_PROXY_TARGET=${API_PROXY_TARGET}

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:20-alpine AS runner

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	API_PROXY_TARGET=http://backend:1400 \
	PORT=1401

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 1401

CMD ["node", "server.js"]
