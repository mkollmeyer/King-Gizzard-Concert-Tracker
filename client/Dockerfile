FROM node:22-alpine AS builder

WORKDIR /src

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the application source code (including tsconfig.json)
COPY . .

# Type-check and build the production bundle into /app/dist
RUN npm run build

# Stage 2: Serve the compiled static assets with Nginx
FROM nginx:alpine


# Copy the built static files from the builder stage
COPY --from=builder /src/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]