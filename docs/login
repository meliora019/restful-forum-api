**Authorize client**
----
Checks for correct email, password and client_id and if parameters are correct returns access token.

* **URL**

    /login

* **Method:**

    `POST`

*  **URL Params**

    None

* **Data Params**

    **Required:**

   `email=[string]`
   `password=[string]`
   `client_id=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
        "success": 1, "token_type": "bearer", "token": <token>, "expires_in": <expiresIn>,
        "user_id": <user_id>, username: <username>
      }`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{success: 0, message: "Either wrong client_id or wrong email and/or password"}`

* **Sample Call:**

  ```javascript
    let response = await fetch('/login', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new FormData(postData)
    });
  ```
