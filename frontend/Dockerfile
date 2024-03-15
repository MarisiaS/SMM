FROM node:21.6.2

WORKDIR /frontend/

COPY package*.json /frontend/
RUN npm install

COPY . /frontend/

CMD ["npm", "run", "dev"]