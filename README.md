# Innosoft API

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