# Use Node.js 19 or 20 for Next.js 16
FROM node:20-slim AS base

# Install pnpm for faster installs
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
# Note: In a real production build, you'd want to set environment variables here
# But for a demo/dev setup, we'll use dev mode or a simple build
RUN pnpm run build

# Production image
FROM node:20-slim AS runner
WORKDIR /app

COPY --from=base /app/next.config.mjs ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
