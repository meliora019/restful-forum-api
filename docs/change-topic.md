**Change topic**
----
Changes forum topic's title.

* **URL**

    /users/:user_id/topics/:topic_id

* **Method:**

    `PUT`

*  **URL Params**

   **Required:**

   `user_id=[string]`
   `topic_id=[string]`

* **Data Params**

    **Required:**

   `title=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Topic title changed"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "success": 0, "message" : "Topic does not exist" }`

  OR
  
  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/topics/:topic_id', {
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
