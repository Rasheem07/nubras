# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port
EXPOSE 3001

# Start Next.js in production mode
CMD ["npm", "start"]
