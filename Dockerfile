FROM node:13

RUN mkdir -p /Users/mnells/src/app

WORKDIR /Users/src/app

EXPOSE 5000

# You can change this
CMD [ "npm", "run", "dev" ]
