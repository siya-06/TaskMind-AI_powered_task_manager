# use an official node.js runtime as a parent image
FROM node:22-alpine

#set the working directory in the container
WORKDIR /app

#copy the package.json and the package-lock.json files to the container
COPY package*.json .

#install the dependencies 
RUN np m install

#copy the rest of the application code
COPY . .

#expose the port that the app runs on
EXPOSE 5003

#define command to run application
CMD ["node","./src/server.js"]