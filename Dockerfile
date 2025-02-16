# Use an official Node.js image
FROM node:20-alpine 

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies first
COPY package*.json ./
RUN npm install --force

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
