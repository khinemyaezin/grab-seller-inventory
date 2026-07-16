FROM node:22-alpine AS build

WORKDIR /workspace

COPY grab-seller-inventory/package*.json ./grab-seller-inventory/
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    cd grab-seller-inventory \
    && npm ci

COPY grab-seller-inventory ./grab-seller-inventory
RUN cd grab-seller-inventory \
    && npm run build

FROM nginx:1.27-alpine AS runtime

COPY grab-seller-inventory/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/grab-seller-inventory/dist /usr/share/nginx/html

ENV API_UPSTREAM=host.docker.internal:8080 \
    NGINX_ENVSUBST_FILTER=API_UPSTREAM

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/mf-manifest.json || exit 1

