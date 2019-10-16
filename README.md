# Schedule Application

This is a schedule application built for demo purposes. This application provides schedule functionality that allows a user to view/create/modify/delete a user/shift. 

The application components include a python flask API with a React UI that interacts with it. A user will be able to hit the API directly or use the UI to write and receive data.

## API Documentation
[API Documentation can be found here](https://app.swaggerhub.com/apis-docs/natefikru/scheduleAPI/1.0.0)

## Deployment
Flask API is deployed at **52.14.162.51:5000** React Application is deployed at [52.14.162.51:3000](http://52.14.162.51:3000) on a single ec2 instance

To Log into React Application use credentials **email: testuser@gmail.com and pw: password**

Ideally, I would run both apps within unique docker containers and deploy them with a container orchestration/deployment tool like docker compose or kubernetes.

## PRELIMINARY NOTES
There are a few features that aren’t complete due to not having enough time. I’ll list them here:

1. Add global state framework like Redux to persist login state (Login function works but does not carry on throughout the pages of the application).
2. Accept user input of DATETIME type when creating shifts from the UI (currently only accepts timestamps even though database is saving as DATETIME)
3. When write calls are invalid and an error is returned, show an error message to the user.
4. Host the application in a secured production environment. (currently running as insecure development)
5. Deploy application using docker for both applications to ensure fundamental steps of a seamless deployment pipeline.
6. Within the API, create a process where, if the call is a write call, (POST, PUT, DELETE), require the userID in the header so the api can check the DB to see if the user is a manager or not. The API would restrict access based on the result (Can also make restricting access for non-managers process more secure by incorporating API keys associated with each user required to make a call.)


## Installation

Clone the git repository, both projects are included within the repo. The “api” folder contains the Flask API while the “dashboard/react-api” folder contains the react application. 
### Flask API
Make sure you have python3 and pip3 installed. From within the api/ directory, install dependendencies by running 
```bash
pip3 install -r requirements.txt
``` 
If the shift_database.db file is not present, you can create it by running 
```bash
python3 models.py
``` 
Start the API by running 
```bash
python3 app.py
``` 
This should initialize the API to run on port 5000.

```bash
pip3 install foobar
```

### React UI
Make sure you have the latest version of node and npm. From within the dashboard/react-api/ directory, install dependencies by running 
```bash
npm install
```
Once the dependencies are installed, you can run the application by running 
```
npm start
```
The application is now running at port 3000

## UI Features
### Login
The UI supports a login module that allows users to authenticate via the browser. The password is encrypted via sha256 on the browser and then sent to the API for string matching. The password is saved to the database in its encrypted format.

### Users
From the users page, all users are displayed. From here you can create a new authenticated user via a createUser component. Here is where passwords are generated. The component makes a call to the API.

You can click an individual user and view their personal information on a separate page. Also available is that user’s assigned shifts. From the User page, you have the ability to delete that user, edit that user and assign that user a new shift.

### Shifts
From the shifts page, all shifts are displayed in order of start time. From this page you are able to create a new Shift. From within the individual shift page, you are able to edit that shift, or delete that shift.

