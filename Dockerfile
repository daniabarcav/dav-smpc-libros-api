# Multi-stage for smaller prod image
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env.example ./
EXPOSE 3000
CMD ["node","dist/main.js"]
