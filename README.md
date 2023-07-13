# Coding-Platform-API
- A Coding platform API where participants can solve questions for the problems provided, run the questions using the Sphere Engine, and the admin can add, edit or delete the questions.
 # Basic Features:
- Role-based authentication system for admin and participants.
    - signup() feature :
        - Input: name, email, password, role
        - Encrypt passwords using any package supporting hash functions.
        - Store users in any NoSQL database (preferably MongoDB or AWS Dynamo DB).
        - Create a JWT-based access token (1-day expiry).
        - Output : email , accesstoken
    - login() feature :
        - Input: email, password
        - Verify email & password from DB and return appropriate response if mismatch.
        - Output : email , accesstoken
- A middleware to differentiate admins from participants.
- A set of APIs for the admin to add, edit or delete the question.
- A set of APIs for the admin to add test cases to a question.
- An API that takes the solution from the user for a particular question. The functionality of that API is
    - Checks if the solution provided is correct or not using Sphere Engine API, and the response also contain the error if it's wrong.
    - Shows the response (error/wrong/success) of the solution
      
#Installation
To run Coding Platform locally, follow these steps:

1. Clone the repository
2. Navigate to the project directory: 'cd coding-platform'
3. Install dependencies: 'npm install'
4. Set up environment variables: Create a .env file in the root directory and add the necessary environment variables. Refer to the .env.example file for required variables.
5. Run server.js using 'node server.js'.
6. Open Postman and access http://localhost:5000 to test Coding Platform API.
   
# API Documentation
Base URL
The base URL for all API endpoints is: http://localhost:5000

Authentication
The following APIs require authentication:
-auth/signup - User signup.
-auth/login - User login.
-problems/questions - Create a new question.
-problems/questions/:questionId - Edit a question.
-problems/questions/:questionId/test-cases - Add a test case to a question.
-problems/questions/:questionId/solution - Check a user's solution.
To access the authenticated APIs, include the JWT token in the request header as follows:
-Authorization: Bearer <token>
# API Endpoints
-Signup
      Create a new user account.
     - URL: /auth/signup
      Method: POST
      Request Body:
      {
       "name": "User Name",
       "email": "user@example.com",
      "password": "password",
      "role": "admin"
      }
      Response:
      Status Code: 200 (Success)
      Body:
      {
      "email": "user@example.com",
      "accessToken": "<token>"
      }
       ![signUp](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/53c9df56-d5fd-4067-a8a6-336eba83a7ec)


-Login
    Authenticate a user and obtain an access token.
    -URL: /auth/login
    Method: POST
    Request Body:
    {
      "email": "user@example.com",
      "password": "password",
      "role": "admin"
    }
    Response:
    Status Code: 200 (Success)
    Body:
    {
      "email": "user@example.com",
      "accessToken": "<token>"
    }
    ![login](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/abc1923e-da21-4e0c-84e4-7ef1ce7c7bb2)

    
-Protected Route
    A protected route accessible only to authenticated admins.
    
    URL: auth/protected-route
    Method: GET
    Authorization: Bearer <token>
    Response:
    Status Code: 200 (Success)
    Body:
    {
      "message": "Access granted for admins"
    }
    
-Create a Question
    Create a new question (only accessible to authenticated admins).
    - 10 questions are already added from problems api of Sphere engine (Check out database for that)
    - Add more question by fetching them from Sphere engine for best results.
        -URL: problems/questions
        Method: POST
        Authorization: Bearer <token>
        Request Body:
        [
          {
            "code": "123",
            "category": "Programming",
            "name": "Question 1",
            "shortBody": "Question description",
            "lastModified": "2023-07-13",
            "permissions": ["admin"],
            "uri": "https://example.com/question1"
          }
        ]
        Response:
        Status Code: 201 (Created)
        Body:
        [
          {
            "code": "123",
            "category": "Programming",
            "name": "Question 1",
            "shortBody": "Question description",
            "lastModified": "2023-07-13",
            "permissions": ["admin"],
            "uri": "https://example.com/question1",
            "_id": "question_id"
          }
        ]
        ![post-questions](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/58922562-8610-4d7b-ab6b-22864b316996)

    
-Get a Random Question
    Retrieve a random question from the database.
    
    URL: problems/questions/random
    Method: GET
    Response:
    Status Code: 200 (Success)
    Body:
    {
      "code": "123",
      "category": "Programming",
      "name": "Question 1",
      "shortBody": "Question description",
      "lastModified": "2023-07-13",
      "permissions": ["admin"],
      "uri": "https://example.com/question1",
      "_id": "question_id"
    }
  ![get-randomQuestion](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/8e212716-e09d-4c2e-b13d-adecfbdc7c2e)

-Edit a Question
    Edit an existing question (only accessible to authenticated admins).
    
    URL: problems/questions/:questionId
    Method: PUT
    Authorization: Bearer <token>
    Request Body:
    {
      "code": "123",
      "category": "Programming",
      "name": "Question 1",
      "shortBody": "Question description",
      "lastModified": "2023-07-13",
      "permissions": ["admin"],
      "uri": "https://example.com/question1"
    }
    Response:
    Status Code: 200 (Success)
    Body:
    {
      "code": "123",
      "category": "Programming",
      "name": "Question 1",
      "shortBody": "Question description",
      "lastModified": "2023-07-13",
      "permissions": ["admin"],
      "uri": "https://example.com/question1",
      "_id": "question_id"
    }
-Delete a Question
    Delete an existing question (only accessible to authenticated admins).
    
    URL: problems/questions/:questionId
    Method: DELETE
    Authorization: Bearer <token>
    Response:
    Status Code: 200 (Success)
    Body:
    {
      "message": "Question deleted successfully"
    }
  ![delete-question](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/59bd3029-a20a-47e2-a6d8-2b3e5888c058)

-Add a Test Case
    Add a test case to an existing question (only accessible to authenticated admins).
    
    URL: problems/questions/:questionId/test-cases
    Method: POST
    Authorization: Bearer <token>
    Request Body:
    {
      "number": 1,
      "active": true
    }
    Response:
    Status Code: 201 (Created)
    Body:
    {
      "code": "123",
      "category": "Programming",
      "name": "Question 1",
      "shortBody": "Question description",
      "lastModified": "2023-07-13",
      "permissions": ["admin"],
      "uri": "https://example.com/question1",
      "testcases": [
        {
          "number": 1,
          "active": true
        }
      ],
      "_id": "question_id"
    }
  ![test-cases](https://github.com/Lunaticfrost/Coding-Platform-API/assets/60070949/f1b619f8-ce90-4139-bb24-eef94354ca87)

-Check Solution
    Check a user's solution for a specific question.
    
      URL: problems/questions/:questionId/solution
      Method: POST
      Request Body:
      {
        "solution": "user solution code"
      }
      Response:
      Status Code: 200 (Success)
      Body:
      {
        "status": "success"
      }
    Possible status values:
    "success": The solution is correct.
    "wrong": The solution is incorrect.
    "error": An error occurred during solution check.
#Note: The Sphere Engine API is used to check the solution.
#Please contact me if any issue arises.
