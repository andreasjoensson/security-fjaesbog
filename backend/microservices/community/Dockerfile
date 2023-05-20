# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /
WORKDIR /

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Make port 8000 (or the port your service uses) available to the world outside this container
EXPOSE 8000

# Run the app when the container launches
CMD ["npm", "start"]