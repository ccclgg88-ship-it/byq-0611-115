FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/backend ./backend
COPY --from=build /app/package.json ./
RUN npm ci --omit=dev
EXPOSE 3001
CMD ["node", "backend/server.js"]
