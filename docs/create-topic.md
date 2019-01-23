**Create topic**
----
Creates forum topic.

* **URL**

    /users/:user_id/topics

* **Method:**

    `POST`

*  **URL Params**

   **Required:**

   `user_id=[string]`

* **Data Params**

    **Required:**

   `title=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Topic created", "topic_id": <topic_id>}`

* **Error Response:**

  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/topics', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
