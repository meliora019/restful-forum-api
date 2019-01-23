**Change username**
----
Changes user's username.

* **URL**

    /users/:user_id

* **Method:**

    `PUT`

*  **URL Params**

   **Required:**

   `user_id=[string]`

* **Data Params**

    **Required:**

   `new_username=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Username changed"}`

* **Error Response:**

  * **Code:** 403 FORBIDDEN <br />

* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id', {
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
