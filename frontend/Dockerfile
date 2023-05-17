# Use an official Node.js runtime as the base image
FROM node:14 as build

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the service's dependencies in the container
RUN npm install

# Copy the rest of your service's code to the working directory
COPY . .

# Build the application for production
RUN npm run build

# Use a Nginx image to serve the React application
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
