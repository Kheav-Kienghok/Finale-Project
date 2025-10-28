FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install deps
RUN npm ci

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]
