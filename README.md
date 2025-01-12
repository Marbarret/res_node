# Busease API Documentation

## Overview
The Busease API enables the management of school transportation services by providing endpoints for user and company functionalities. It is built using Node.js with the Express framework and MongoDB as the database.

## Prerequisites:
- Node.js (v12)
- MongoDB (Atlas)
- npm

## API Base Information

- Base Path: /busease-api/v1
- Version: 1.0
- Schemes: HTTP, HTTPS

## Endpoints
**List all users**

- URL: `/bse/`
- Method: GET
- Description: Retrieves all registered users.

**Create a new user**

- URL: ```/bse/```
- Method: POST
- Description: Registers a new user.

Request Body:
```http
{
  "role": "string",
  "responsible": {
    "fullName": "string",
    "email": "string",
    "document": {
      "document_type": "string",
      "number": "string"
    },
  },
  "password": "string",
  "terms": true
}
```
**Get User by Document**

- URL: ```/bse/{document}```
- Method: GET
- Description: Retrieves user details by Document.
- Path Parameters:
  - document: string (document)

**Get User by E-mail**

- URL: ```/bse/{email}```
- Method: GET
- Description: Retrieves user details by E-mail.
- Path Parameters:
  - email: string (email)

**Update User Partially**

- URL: ```/bse/{document}```
- Method: PATCH
- Description: Updates specific user fields by Document.
- Path Parameters:
  - document: string (document)

**Delete User**

- URL: ```/bse/{document}```
- Method: DELETE
- Description: Delete user by Document.
- Path Parameters:
  - document: string (document)

### Dependents
**List Dependents**

- URL: ```/bse/{document}/dependent```
- Method: GET
- Description: Retrieves a list of dependents for a given document.
- Path Parameters:
  - document: string (document)

**Add a Dependent**

- URL: ```/bse/{document}/dependent```
- Method: POST
- Description: Adds a dependent to a user.
- Path Parameters:
  - document: string (document)


### Authentication
**Login**

- URL: ```/auth/login```
- Method: POST
- Description: Authenticates a user and returns an access token.
- Request Body:
```http
{  
  "email": "string",  
  "password": "string"  
}
```

**Verify User**

- URL: ```/bse/verify```
- Method: POST
- Description: Sends a verification code to the user’s email for account validation.
- Request Body:
```http
{
  "email": "string",
  "verificationCode": "string"
}
```

**Resend Verification Code**

- URL: ```/bse/resend-code/```
- Method: POST
- Description: Resends the account verification code to the user’s email.
- Request Body:
```http
{
  "email": "string"
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

