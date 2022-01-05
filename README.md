# Innosoft API
[![Node.js CI](https://github.com/Pingu-Developers/InnosoftAPI/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Pingu-Developers/InnosoftAPI/actions/workflows/nodejs.yml)
[![Coverage Status](https://coveralls.io/repos/github/Pingu-Developers/InnosoftAPI/badge.svg?branch=main)](https://coveralls.io/github/Pingu-Developers/InnosoftAPI?branch=main)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)

## Introduction
Innosoft API is a RESTful API for exposing the Innosoft backend data following the OpenApi 3.0 Specification. 
The project has been initially generated using the [oas-generator](https://www.npmjs.com/package/oas-generator) tool.

The OAS file is located at ```/api/oas-doc.yaml```

## Endpoints
Endpoints documentation is available at ```{host}/docs```:

### API V1

#### Events
[GET] ```/api/v1/events```: Returns a list containing all events.
[GET] ```/api/v1/events/{id}```: Returns the event with the given id.

#### Speakers
[GET] ```/api/v1/speakers```: Returns a list containing all speakers.
[GET] ```/api/v1/speakers/{id}```: Returns the speaker with the given id.

#### Posts
[GET] ```/api/v1/posts```: Returns a list containing all posts.
[GET] ```/api/v1/posts/{id}```: Returns the post with the given id.

## Testing

### Unit testing
Unit tests have been coded using sinon mocks for Mysql and MongoDB queries. Unit tests are run with [mocha](https://www.npmjs.com/package/mocha) by executing ```npm run test```. The ```tests/unit/tests.json``` file contains the list of unit tests to be executed.

### End-to-end testing
End-to-end testing is done by running the ```tests/docker-compose-e2e.yml``` file. Tests are executed by executing ```npm run e2e```.

### Load testing
Locust is used to load test the API. Locust is executed inside a Docker container, Locust service can be be found inside the ```tests/docker-compose-e2e.yml``` file. In order to run load tests, execute ```npm run e2e```, then access to Locust interface at ```http://localhost:8089/```. The locustfile containing the tasks can be found at ```tests/locustfile.py```.
