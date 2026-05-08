FROM node:24-alpine AS base
WORKDIR /www

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
ENV CI=true
COPY . ./

ARG NODE_ENV=production
ARG TURBO_TELEMETRY_DISABLED=1
ARG VITE_API_BASE_URL=http://127.0.0.1:8080
ARG DO_NOT_TRACK=1
ENV NODE_ENV=${NODE_ENV} \
	TURBO_TELEMETRY_DISABLED=${TURBO_TELEMETRY_DISABLED} \
	VITE_API_BASE_URL=${VITE_API_BASE_URL} \
	DO_NOT_TRACK=${DO_NOT_TRACK}

RUN npm add -g pnpm && pnpm install --frozen-lockfile && \
	npm run build && \
	find . -type f -name "*.ts" -delete && \
	find . -type f -name "*.tsx" -delete

FROM base AS runner
RUN apk add --no-cache \
				nginx \
				supervisor \
				openssl

COPY --from=builder /www ./
COPY ./ci/supervisord.conf /etc/supervisord.conf
COPY ./ci/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /run/nginx && \
	chown -R nginx:nginx /www /run/nginx && \
	chmod -R 770 /www /run/nginx

USER nginx

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV DO_NOT_TRACK=1

EXPOSE 8080/tcp
ENTRYPOINT ["supervisord", "-c", "/etc/supervisord.conf"]
