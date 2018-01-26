# Backend Code Challenge


## How to run

Clone the repo and cd into the directory. You then have two options:

### Running the API locally with Mongo and Redis in Docker containers

run `sudo sh startup.sh`

to quit, input `^c`, and then run  `sh teardown.sh`

### Running everything in docker containers

run `docker-compose up -d`

## Running the e2e tests

Once the api is running, run `npm test` in the directory

---

Welcome!

For this code challenge we would like you to write a simple NodeJS REST API project in [express.js](https://expressjs.com/) framework, and then extend it with some functionalities below.


## Adding MongoDB

Write an API endpoint for saving a JSON object in MongoDB. Mongo DB should be running in a Docker Container.

- Input:
  - JSON Object
- Output:
  - 200 OK or error code

Write also an API endpoint for getting a list of all previously saved JSON objects filtered by some field’s value, in pages, N objects per page:

- Input:
  - field’s value
  - page number
- Output:
  - list of JSON objects (no more than N)


## Adding Tests

Write end-to-end test(s) for these 2 endpoints.

Tests should be rerunnable and independent of their execution order. Make sure you test the most tricky cases.


## Adding Caching

Start Redis in Docker (same way as Mongo) and implement Redis caching for the second endpoint (get list).


## Running everything

Ensure that we're able to setup and run everything with a task runner or a similar tool both locally and in Docker environment. This means we expect to see a Dockerfile and docker-compose.yml files.


## How to deliver the results

Fork this repo and once you're done send us a link to a repo with your solution. The result should be your own repository on Github with instructions how to run tests.
