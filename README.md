# Busease API Documentation

## Overview
The Busease API enables the management of school transportation services by providing endpoints for user and company functionalities. It is built using Node.js with the Express framework and MongoDB as the database.

## Prerequisites:
- Node.js (v12)
- MongoDB (Atlas)
- npm

## API Endpoints
 **Base URL**
 - Local: `http://localhost:5000`
- Production: `http://busease/v1/`

## Authentication
**Register User**

POST `/v1/..`

Description: Registers a new user.

Request Body:
```http
{  
  "fullName": "string",  
  "email": "string",  
  "password": "string"  
}
```

**Login User**

POST `/v1/..`

Description: Login a user.

Request Body:
```http
{  
  "email": "string",  
  "password": "string"  
}
```
## User Management
#### Get User Profile

GET `/v1/users/{id}`

Description: Fetches the profile of a specific user.

Response:
```http
{  
  "fullName": "string",  
  "email": "string", 
  "dependent": {  
    "planName": "string",  
    "remainingDays": "number"  
  }  
}  
```

## Error Handling
#### All error responses follow the format:
```http
{  
  "error": "string",  
  "message": "string"  
} 
```

## Licença


