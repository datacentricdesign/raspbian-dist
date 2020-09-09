FROM node:alpine

# Create app directory
WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy sources
COPY . .

# Run the production script
CMD [ "npm", "run", "start" ]