FROM node:21.6.2

# Set environment variable
ENV CHOKIDAR_USEPOLLING=true

WORKDIR /frontend/

COPY package*.json /frontend/
RUN npm install

COPY . /frontend/

CMD ["npm", "run", "dev"]