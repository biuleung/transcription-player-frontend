FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use an official Nginx image as the production image
FROM nginx:stable-alpine

# Copy the built Vue app from the builder stage
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html/

# Copy the custom Nginx configuration
COPY --chown=nginx:nginx deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
