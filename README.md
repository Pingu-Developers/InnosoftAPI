# Innosoft API
[![Node.js CI](https://github.com/Pingu-Developers/InnosoftAPI/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Pingu-Developers/InnosoftAPI/actions/workflows/nodejs.yml)
[![Coverage Status](https://coveralls.io/repos/github/Pingu-Developers/InnosoftAPI/badge.svg?branch=main)](https://coveralls.io/github/Pingu-Developers/InnosoftAPI?branch=main)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)

## 📖 Introduction 
Innosoft API is a RESTful API for exposing the Innosoft backend data following the OpenApi 3.0 Specification. 
The project has been initially generated using the [oas-generator](https://www.npmjs.com/package/oas-generator) tool.

The OAS file is located at ```/api/oas-doc.yaml```

## 📌 API Endpoints
Endpoints documentation is available at ```{host}/docs```:

### Events
* [GET] ```/api/v1/events```: Returns a list containing all events.
* [GET] ```/api/v1/events/{id}```: Returns the event with the given id.

### Speakers
* [GET] ```/api/v1/speakers```: Returns a list containing all speakers.
* [GET] ```/api/v1/speakers/{id}```: Returns the speaker with the given id.

### Posts
* [GET] ```/api/v1/posts```: Returns a list containing all posts.
* [GET] ```/api/v1/posts/{id}```: Returns the post with the given id.

## 📡 WebSocket
The service implements a websocket server at port ```:5001```. This socket has been used for chat implementation. Its configuration can be found at ```socket/index.js```, the socket listens to the following events:<br/>
* **ChatConnection:** When a new user connects to chat through this event, a system message saying user joined is emitted to the client, then the client is assigned to the room requested and all messages from that room are retrieved from DB and emitted.
* **ChatMessage:** When a new message is sent from the client, the server builds the Message Object from the Model declared at ```models/Message```, then emits a ```chatMessage``` event to the client containing that message.
* **chatDisconnect:** When user disconnect, a new event saying that the user left is emitted to the room.

## 🤖 CI/CD
The continuous integration strategy is based in a common Node.js workflow. However, since the system is not a node package but a web server, it is Dockerized and pushed to DockerHub instead of published to NPM registry or similar. The workflow execute different steps depending on which ref the commits are pushed to, pull requests are also taken into account when running the CI ([view workflow file](/.github/workflows/nodejs.yml)).

#### Lint, test and coverage report
This job is executed in push and pull requests, it checks code syntax using [semistandard](https://www.npmjs.com/package/semistandard), then runs unit test and execute Istambul's coverage tool. Coverage report is then submitted to [Coveralls](https://coveralls.io) with GITHUB_TOKEN so the coverage percentage can be shown in repo's badge.

#### Build Docker image
In order to build a docker image using CI, setting up Docker in the runner is needed. Docker provides actions for setting up QEMU, BuildX and login to DockerHub. DOCKERHUB_USER and DOCKERHUB_PASSWORD secrets are needed. Once the login succeeds, the image is built and pushed to hub, image digest is echoed at the end. If commits are pushed to ```develop``` branch, docker image tag will be set to ```:develop```, while when pushed to ```main``` tag is set to the version tag produced by [Conventional Changelog](https://github.com/TriPSs/conventional-changelog-action). This job is skipped on pull requests.

#### Integration Tests run
In case commits are pushed to develop, end to end tests are runned after building and pushing docker image, this way the new image is tested right after being pushed. On the other hand, on commits to main branch, integration tests run before publishing the new release. Main commits come directly from develop, this way the develop image is tested before dockerizing and publishing a new release.

#### Release
Before creating a release, a changelog is generated using Conventional Changelog action. This action outputs the new version, that is assigned depending on the commits following [Conventional Commits format](https://www.conventionalcommits.org/en/v1.0.0/). This way, using Github's release action, a new Github Release is created with the new version tag, the generated Changelog.md is attached to release and pushed to repo with GITHUB_TOKEN, so the workflow doesn't get triggered in loops. Finally, after publishing github release, code is dockerized and pushed, and a sync pull request is created from main to develop.

## 🚀 Deployment
The deployment of the system depends on the environment it will be deployed to: Testing, Development and Production.

### Testing Environment
When in tests environment, Docker is used to deploy and execute tests on the code. The system can be deployed by running ```docker-compose up``` on ```/tests/docker-compose-test.yml```. This compose contains the following services:
* MongoDB: Initially empty, tests credentials are set on environment and connections are made internally through docker network.
* MysqlDB: Filled with test data at ```test/dbdata/innosoft.sql```, like in MongoDB, test credentials are set on env vars and connections are made internally.
* Locust: Locust container for running load testing, it depends on locust file found at test directory.
* Api: The api service itself, subject of testing. Service is deployed at host port 5000 (5001 for websocket) and test requests are sent to http://localhost:5000.
Further details on testing are explained below at [testing section](https://github.com/Pingu-Developers/InnosoftAPI#testing).

### Development Environment
When developping, required infrastructure can be provided by executing Docker containers while running the code on host and connecting to containers. In order for that to work, container ports where containers run MongoDb and Mysql shall be binded to host machine ports. Additionally, a Mysql database administration tool like PhpMyAdmin can be deploy to manage the database. The following docker-compose.yml file can be used for running the required infrastructure:

```
version: '3.1'

services:
  db:
    container_name: mysql_db
    image: percona
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=innosoft
    ports:
      - "3306:3306"

  innoChatDb:
    container_name: innoChatDb
    image: mongo
    restart: 'unless-stopped'
    ports:
      - '27017:27017'

  phpmyadmin:
    container_name: phpmyadmin
    image: phpmyadmin
    restart: 'unless-stopped'
    ports:
      - '8080:80'
    environment:
      - PMA_ARBITRARY=1
```
When running the API using ```npm start```, by default it will connect to the services declared in compose file if no environment variables are specified.

### Production Environment
When in production environment, databases ports should not be binded to server ports, since exposing databases lead to potential vulnerabilities. Instead, database connections are made internally through Docker network. Besides, in order to make data persistent, volumes should be declared or else data will be lost upon containers' restart. Service like phpmyadmin can still be deployed but make sure not to expose any credentials and use a .env file on server that is never disclosed or uploaded to public site(s). The following docker-compose.yml file can be used for a production deployment:

```
  version: '3.1'

  services:
    mysql_db:
      container_name: mysql_db
      image: percona
      restart: always
      volumes:
        - 'mysqlDb:/var/lib/mysql'
      environment:
        - MYSQL_ROOT_PASSWORD=${DB_PASSWORD:?}

    phpmyadmin:
      container_name: phpmyadmin
      image: phpmyadmin
      restart: always
      ports:
        - '8080:80'
      environment:
        - PMA_ARBITRARY=1

    innoChatDb:
      container_name: innoChatDb
      image: mongo
      volumes:
        - 'innoChatDb:/data/db'
      restart: 'unless-stopped'

    innoApi:
      container_name: innoApi
      image: pingudevelop/innosoft-api:latest
      restart: always
      ports:
        - '80:80'
        - '5001:5001'
      environment:
          - PORT=${PORT:?}
          - DB_HOST=mysql_db
          - DB_PORT=${DB_PORT:?}
          - DB_USER=${DB_USER:?}
          - DB_PASSWORD=${DB_PASSWORD:?}
          - DB_NAME=${DB_NAME:?}
          - MONGO_HOST=innoChatDb
          - MONGO_PORT=${MONGO_PORT:?}
          - MONGO_DBNAME=${MONGO_DBNAME}
          - SOCKER_PORT=${SOCKER_PORT}

  volumes:
    innoChatDb: null
    mysqlDb: null
```
To deploy the system just write a .env file containing the enironment variables and run ```docker-compose --env-file .env up -d```. Environment variables and their default value can be found at the [environment section](#Environment).

### Deploying on VMs
Deploying systems on virtual machines is a way to test isolated environments. Innosoft API provides support to install itself inside a virtual machine through Vargrant & Ansible, configuration files can be found inside Vagrant directory. Steps on how to run the app on Vagrant using Ansible are described below:

#### Prerequisites
On a **Linux machine**, install Vagrant, Ansible and VirtualBox.
```
sudo apt install Vagrant Ansible Virtualbox
```

#### Provisioning Databases
Since the current configuration only deploys the API service, you may need to install mysql and mongodb inside the VM. Running them on Docker in host (or in vm) and connecting through localhost by binding ports is also a valid workaround.

#### Running Vagrant
API provisioning is configured through Ansible in ```Vagrant/playbook.yml``` file, so in order to run the VM, install and run the Node.js Application, just run vagrant up command.
```
Vagrant up
```

## ⚙ Environment
* **PORT:** Container port where de Node.js application will run. Default = `80`
* **DB_HOST:** Mysql database host. Defaults to DB service name for internal connection.
* **DB_PORT:** Mysql database port. Default = `3306`.
* **DB_USER:** Mysql database user to connect with. Default = `root`.
* **DB_PASSWORD:** Mysql password for connection. Default = `innosoft`.
* **DB_NAME:** Mysql database name to connect to. Default = `innosoft`.
* **MONGO_HOST:** MongoDB host to connect to. Defaults to DB service name for internal connection.
* **MONGO_PORT:** MongoDB port. Default = `27017`.
* **MONGO_DBNAME:** MongoDB database that will be created upon connection. Default = `innoChat`.
* **SOCKET_PORT:** Server port where the server-side websocket application will run. Default = `5001`.

## 🧪 Testing

### Unit testing
Unit tests have been coded using sinon mocks for Mysql and MongoDB queries. Unit tests are run with [mocha](https://www.npmjs.com/package/mocha). To execute unit tests run the following line:
```
npm run test:unit
```
The ```tests/unit/tests.json``` file contains the list of unit tests to be executed.

### Integration testing
Integration testing is done by running the ```tests/docker-compose-test.yaml``` file. Tests are executed by executing the following command:
```
npm run test:integration
```

### Load testing
Locust is used to load test the API. Locust is executed inside a Docker container, Locust service can be be found inside the ```tests/docker-compose-test.yml``` file. In order to run load tests, execute:
```
npm run test:load
```
Then access to Locust interface at ```http://localhost:8089/```. The locustfile containing the tasks can be found at ```tests/locustfile.py```.


