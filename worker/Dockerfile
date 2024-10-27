FROM node:16-alpine

WORKDIR /engine

COPY  ./package.json .

RUN npm install 
RUN npm install typescript
COPY . .
RUN npm run build
EXPOSE 3001 

CMD [ "npm", "start" ]