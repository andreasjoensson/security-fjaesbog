# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the service's dependencies in the container
RUN npm install

# Copy the rest of your service's code to the working directory
COPY . .

# Expose the port that your service listens on
EXPOSE 1000

# Define the command to run your service
CMD [ "npm", "start" ]
