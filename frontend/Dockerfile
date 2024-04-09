FROM node:21.6.2

ENV CHOKIDAR_USEPOLLING=true

WORKDIR /frontend/

COPY package*.json /frontend/
RUN npm install

COPY . /frontend/

CMD ["npm", "run", "dev"]