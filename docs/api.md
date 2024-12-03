[v1.0.0] - 2024-10-05: Added
New Feature: Implemented signup endpoint.
Path: /api/v1/auth/signup
Method: POST
Request Body: Expects a JSON object with user details.

Example:
Request Body:

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
}

Response:
Success (201): Returns a success message and the created user object.
Error (400): Returns validation error messages if the input is invalid.


[v1.0.0] - 2024-10-24: Added
New Feature: Implemented login endpoint.
Path: /api/v1/auth/login
Method: POST
Request Body: Expects a JSON object with the user's login credentials.

Example Request Body:

{
    "email": "john.doe@example.com",
    "password": "securepassword123"
}

Response:
Success (200): Returns a success message and the user’s details along with the authentication token.
Error (400): Returns an error message if the login credentials are invalid.
Error (500): Returns an internal error message if there is an issue with the login process.


Here's the documentation for the two routes you provided (verifyOTPController and resendOTPController):

[v1.0.0] - 2024-10-24: Added
New Feature: Implemented OTP verification and resend endpoints.
1. Verify OTP Endpoint
Path: /api/v1/auth/verify-otp
Method: POST
Request Body: Expects a JSON object with the OTP details.

Example Request Body:

{
    "email": "john.doe@example.com",
    "otp": "123456"
}

Response:

Success (200): Returns a success message and user details along with the authentication token if the OTP is valid.
Error (400): Returns an error message if the OTP is invalid or expired.


2. Resend OTP Endpoint
Path: /api/v1/auth/resend-otp/:email
Method: GET
Request Params: Expects an email parameter.

Response:

Success (200): Returns a success message and the newly generated OTP.
Error (400): Returns an error message if the provided email is invalid or if there's an issue with generating the OTP.

[v1.0.0] - 2024-10-24: Added
New Feature: Implemented get current user profile endpoint.
1. Get Current User Profile Endpoint
Path: /api/v1/user
Method: GET
Request: Requires the user to be authenticated, and the user.id will be extracted from the request object.
Example Request (Authorization Header):


GET /api/v1/user
Authorization: Bearer <your-access-token>
Response:

Success (200): Returns a success message along with the current user's profile data.

Error (500): Returns an error message if there's an issue retrieving the user's profile data.


[v1.0.0] - 2024-11-02: Added
New Features: Implemented wallet management endpoints.

1. Fund Wallet Endpoint
Path: /api/v1/wallet/fund
Method: POST
Request Body: Expects a JSON object with the wallet funding details.

Example Request Body:

{
  "amount": 5000,
  "description": "Fund wallet for transaction"
}

Response:
Success (200): Returns a success message confirming that the wallet has been funded.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
    "message": "Wallet funded successfully",
    "data": {}
}

Error (500): Returns an error message if there was an issue funding the wallet.


2. Withdraw Funds Endpoint
Path: /api/v1/wallet/withdraw
Method: POST
Request Body: Expects a JSON object with the withdrawal details.


Example Request Body:
{
  "amount": 3000,
}

Response:
Success (200): Returns a success message confirming that the funds were successfully withdrawn.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
    "message": "Wallet Withdrawal successful",
    "data": {}
}

Error (500): Returns an error message if there was an issue withdrawing the funds.
{
    "statusCode": 500,
    "status": "error",
    "success": false,
    "message": "Insufficient balance"
}


3. Get User Wallet Endpoint
Path: /api/v1/wallet
Method: GET
Response: Returns the details of the user's wallet.

Example Response:

{
    "statusCode": 200,
    "status": "success",
    "success": true,
    "message": "Wallet funded successfully",
    "data": {
        "_id": "67389d11b085406135696470",
        "wallet_id": "1102239932",
        "balance": 100000,
        "status": "ACTIVE"
    }
}

Error (500): Returns an error message if there was an issue retrieving the wallet.
{
  "error": "Could not get user wallet"
}


4. Resolve Wallet Endpoint
Path: /api/v1/wallet/resolve
Method: POST
Request Body: Expects a JSON object with the wallet ID to resolve.

Example Request Body:
{
  "walletId": "walletId123"
}
Response:

Success (200): Returns the details of the resolved wallet.

{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "Wallet resolved successfully",
  "data": {
    "_id": "walletId123",
    "wallet_id": "T4DWALLET/JOHN DOE",
    "walletName": "T4DWALLET/JOHN DOE",
    "status": "ACTIVE"
  }
}
Error (500): Returns an error message if there was an issue resolving the wallet.

Here is the documentation for the two new wallet pin management controllers:

[v1.0.0] - 2024-11-05: Added
New Features: Added endpoints for setting and changing wallet PIN.

1. Set Wallet Pin Endpoint
Path: /api/v1/wallet/pin/set
Method: POST
Request Body: Expects a JSON object containing the wallet PIN to set.


Example Request Body:

{
  "wallet_pin": "1234"
}

Response:

Success (200): Returns a success message indicating that the wallet pin has been set.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "wallet pin set",
  "data": true
}

Error (500): Returns an error message if there was an issue setting the wallet pin.


2. Change Wallet Pin Endpoint
Path: /api/v1/wallet/pin/update
Method: POST
Request Body: Expects a JSON object containing both the old and new wallet PINs.


Example Request Body:

{
  "old_pin": "1234",
  "new_pin": "5678"
}
Response:

Success (200): Returns a success message confirming that the wallet pin has been updated successfully.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "wallet pin updated successfully",
  "data": true
}


Error (500): Returns an error message if there was an issue changing the wallet pin.
{
  "error": "Could not reset wallet pin"
}

[v1.0.0] - 2024-11-15: Added
New Features: Added endpoints for managing beneficiaries.

1. Save New Beneficiary Endpoint
Path: /api/v1/beneficiaries/new
Method: POST
Request Body: Expects a JSON object containing the details of the new beneficiary.

Example Request Body:

{
    "walletId": 1111111,
    "alias": "My sister" // optional
}

Response:

Success (200): Returns a success message indicating that the beneficiary has been saved.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "Beneficiary saved successfully",
  "data": {}
}

Error (500): Returns an error message if there was an issue saving the beneficiary.
{
  "error": "Could not save beneficiary"
}


2. Delete Beneficiary Endpoint
Path: /api/v1/beneficiaries/:beneficiaryId/remove
Method: DELETE
Request Parameters:
beneficiaryId: The ID of the beneficiary to be deleted.
Response:

Success (200): Returns a success message with the deleted beneficiary data.

Error (500): Returns an error message if there was an issue deleting the beneficiary.
{
  "error": "Could not delete beneficiary"
}

3. Get All Beneficiaries Endpoint
Path: /api/v1/beneficiaries/
Method: GET
Response:
Success (200): Returns a list of all beneficiaries.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "Beneficiaries retrieved successfully",
  "data": [
    {
      "id": "12345",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "bankAccountNumber": "1234567890",
      "bankName": "Example Bank"
    },
    {
      "id": "12346",
      "name": "Jane Smith",
      "email": "janesmith@example.com",
      "bankAccountNumber": "0987654321",
      "bankName": "Sample Bank"
    }
  ]
}

Error (500): Returns an error message if there was an issue retrieving the beneficiaries.
{
  "error": "Could not retrieve beneficiaries"
}


4. Get One Beneficiary Endpoint
Path: /api/v1/beneficiaries/:beneficiaryId
Method: GET
Request Parameters:
beneficiaryId: The ID of the beneficiary to retrieve.

Response:

Success (200): Returns the details of the specified beneficiary.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "Beneficiary retrieved successfully",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "bankAccountNumber": "1234567890",
    "bankName": "Example Bank"
  }
}

Error (500): Returns an error message if there was an issue retrieving the beneficiary.
{
  "error": "Could not retrieve beneficiary"
}
5. Search Beneficiaries Endpoint
Path: /api/v1/beneficiaries/search
Method: POST
Request Body: Expects a JSON object with a search query to find beneficiaries.

Example Request Body:
{
  "query": "John"
}
Response:

Success (200): Returns a list of beneficiaries matching the search query.
{
    "statusCode": 200,
    "status": "success",
    "success": true,
  "message": "Beneficiary retrieved successfully",
  "data": [
    {
      "id": "12345",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "bankAccountNumber": "1234567890",
      "bankName": "Example Bank"
    }
  ]
}
Error (500): Returns an error message if there was an issue searching for beneficiaries.
{
  "error": "Could not retrieve beneficiaries"
}

[v1.0.0] - 2024-11-20: Added
New Feature: Added endpoint for transferring funds between users.
Transfer Funds Endpoint
Path: /api/v1/transfer
Method: POST
Request Body: Expects a JSON object containing the details of the transfer.

Example Request Body:
{
  "amount": 100.50,
  "receipientId": "abcd1234",
  "description": "Payment for services"
}

Request Body Parameters:
amount (number, required): The amount to transfer.
receipientId (string, required): The ID of the recipient of the funds.
description (string, optional): An optional description for the transfer.

Validation:
amount: Must be a positive number.
receipientId: Must be a string of at least 4 characters.
description: Must be a string, if provided, and is optional.
Response:

Success (200): Returns a success message with the updated balance.
{
  "message": "Wallet funded successfully",
  "data": {
    "balance": 1500.75
  }
}

Error (400): Returns an error message if the request body is invalid or the transfer fails.
{
  "error": "Invalid amount or recipient ID"
}