# Use Node 20
FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Build the frontend and backend
RUN npm run build

# Expose port 5000 (standard for this app)
EXPOSE 5000

# Start command
CMD [ "npm", "start" ]
