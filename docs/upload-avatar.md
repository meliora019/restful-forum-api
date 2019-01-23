**Upload avatar**
----
Uploads avatar and saves it into folder.

* **URL**

    /users/:user_id/avatar

* **Method:**

    `PUT`

*  **URL Params**

   **Required:**

   `user_id=[string]`

* **Data Params**

    **Required:**

   `avatar=[file]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Avatar uploaded"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"success": 0, "message": "No avatar was uploaded"}`

  OR

  * **Code:** 403 FORBIDDEN <br />

* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/avatar', {
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'Content-Type': 'multipart/form-data',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
