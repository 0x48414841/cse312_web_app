### To build and run locally

```Download MongoDB from https://www.mongodb.com/try/download/community?tck=docs_server```

```npm install``` in main directory

```cd client``` move into client directory

```npm install``` This installs react and frontend dependencies

```cd ..``` move back out to the main directory

```npm run dev-local``` Starts development server

### To build and run in Docker

```docker-compose up``` in main (root) directory of the project

```Connect to http://localhost:3000``` when docker finishes building the containers



https://docs.docker.com/compose/gettingstarted/
https://www.youtube.com/watch?v=Qw9zlE3t8Ko
https://www.thepolyglotdeveloper.com/2019/01/getting-started-mongodb-docker-container-deployment/

docker build -t website .
container run --publish 7000:3000 --detach website
