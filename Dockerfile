FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/out ./out
EXPOSE 3000
CMD ["serve", "-s", "out", "-l", "3000"]
