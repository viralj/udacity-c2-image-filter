# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed along side the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/grutt/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Backend](https://github.com/grutt/udacity-c2-restapi)
Which is a Node-Express server which can be deployed to a cloud service.
3. [The Image Filtering Microservice](https://github.com/grutt/udacity-c2-image-filter) `This Repo`
Which is the final project for the course. It is a Node-Express application which runs a simple Python script to process images.

## Tasks
### Setup Python and a Python Virtual Enviornment
You'll need to set up and use a virtual environment for this project.

To create a virtual enviornment run the following from within the project directory:

1. Install virtualenv dependency: `pip install virtualenv`
2. Create a virtual enviornment:    `virtualenv venv`
3. Activate the virtual enviornment: `source venv/bin/activate` (Note: You'll need to do this every time you open a new terminal)
4. Install dependencies: `pip instal -r requirements.txt`

Whe you're done working and leave the virual enviornment, run: `deactivate`

### Setup Node Enviornment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm init`
2. Install express: `npm i express --save`
3. Install typescript dependencies: `npm i ts-node-dev tslint typescript  @types/bluebird @types/express @types/node --save-dev`
4. Add the following line to  `package.json`:

``` typescript
"dev": "ts-node-dev --respawn --transpileOnly ./src/server.ts"
```
5. run the development server with `npm run dev`

### Create a new server.ts file

Use our basic server as an example to set up this file. For this project it's ok to keep all of your business logic in the one server.ts file, but you can try to use feature directories and app.use routing if you're up for it. Use the RestAPI structure to guide you.

### Add an endpoint to handle GET processedimage requests

It should accept two POST parameter:

> **image_url:** string - a public url of a valid image file

It should respond with 422 unprocessable if either POST parameter are invalid.

It should require a token in the Auth Header or respond with 401 unauthorized.

> The matching token should be saved as an enviornment variable
> (TIP we broke this out into its own auth.router before, but you can access headers as part of the req.headers within your endpoint block)

It should respond with the image as the body if upload_image_signedUrl is included in the request.

It should respond with a success message if upload_image_signedUrl is NOT included in the request.

### Deploying your system

Follow the process described in the course to `eb init` a new application and `eb create` a new enviornment to deploy your image-filter service!

## Stand Out (Optional)

### Refactor the course RESTapi

If you're feeling up to it, refactor the course RESTapi to make a request to your newly provisioned image server. 

### Postman Integration Tests

Try writing a postman collection to test your endpoint. Be sure to cover:
> POST requests with and without tokens
> POST requests with valid and invalid parameter

#### (ADVANCED) Refactor Data Models

Try adding a second OpenCV filter script and add an addtional parameter to select which filter to use as a POST parameter