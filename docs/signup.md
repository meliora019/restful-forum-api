**Register User**
----
Registers the user to the system and returns the execution status in json.

* **URL**

    /users

* **Method:**

    `POST`

*  **URL Params**

    None

* **Data Params**

    **Required:**

   `email=[string]`
   `username=[string]`
   `password=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Registration successful"}`

* **Error Response:**

  * **Code:** 409 CONFLICT <br />
    **Content:** `{"success": 0, "message": "User exists"}`

* **Sample Call:**

  ```javascript
    let response = await fetch('/users', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new FormData(postData)
    });
  ```
