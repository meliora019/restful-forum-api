**Change password**
----
Changes user's password.

* **URL**

    /users/:user_id/password

* **Method:**

    `PUT`

*  **URL Params**

   **Required:**

   `user_id=[string]`

* **Data Params**

    **Required:**

   `current_password=[string]`

   `new_password=[string]`

   `new_password_confirmation=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Password changed"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"success": 0, "message": "Wrong current password or password and its confirmation don't match"}`

  OR

  * **Code:** 403 FORBIDDEN <br />

* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/password', {
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
