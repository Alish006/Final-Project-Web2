# Habit Tracking Application

## Project Overview

This is a Habit Tracker web application built using Node.js, Express, MongoDB, and EJS for server-side rendering. The application allows users to register, log in, and manage their habits. Users can create, edit, delete, and view their habits. Additionally, there is an admin feature that allows certain users to delete habits.

## Features

- User authentication (register, login, logout)
- Habit management (create, edit, delete, view)
- User profile management (edit username, email, admin status)
- Admin privileges (delete habits)

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed and running
- Git (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alish006/Final-Project-Web2.git
   cd Final-Project-Web2
2. Install dependencies:
npm install

3. Create a .env file in the root directory and add the following environment variables:
URL=mongodb+srv://AlisherSamat:24atahud@cluster0.4f8pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
SECRET_KEY_SESSISON=secret_key
ACCESS_TOKEN_SECRET=my_secret_key

4. Start the server:
npm start 

5. Open your browser and navigate to http://localhost:3000/register or http://localhost:3000/login


## API Documentation

Authentication
POST /register: Register a new user

Request Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}
Response: Redirects to /login on success

POST /login: Log in an existing user

Request Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}
Response: Redirects to /profile on success

Habits
GET /habit: Get all habits for the logged-in user

Response: HTML page displaying all habits

GET /habit/post: Render the form to create a new habit

Response: HTML form

POST /habit: Create a new habit

Request Body:
{
  "name": "string",
  "description": "string",
}
Response: HTML page confirming habit creation

GET /habit/:id : Get a specific habit by ID

Response: HTML page displaying the habit details

GET /habit/:id /edit: Render the form to edit a specific habit

Response: HTML form

PUT /habit/:id : Update a specific habit

Request Body:
{
  "name": "string",
  "description": "string",
  "weeklyStatus": "boolean"
}
Response: HTML page confirming habit update

DELETE /habit/:id : Delete a specific habit

Response: HTML page confirming habit deletion

Profile
GET /profile: Get the profile of the logged-in user

Response: HTML page displaying user profile

GET /profile/edit: Render the form to edit the user profile

Response: HTML form

PUT /profile: Update the user profile

Request Body:
{
  "username": "string",
  "email": "string",
  "isAdmin": "boolean"
}
Response: Redirects to /profile on success
