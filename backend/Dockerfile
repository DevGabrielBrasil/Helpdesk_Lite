FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-slim AS runner
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
