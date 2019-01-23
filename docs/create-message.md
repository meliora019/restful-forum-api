**Create message**
----
Creates messages for forum topic.

* **URL**

    /users/:user_id/topics/:topic_id/messages

* **Method:**

    `POST`

*  **URL Params**

   **Required:**

   `user_id=[string]`
   `topic_id=[string]`

* **Data Params**

    **Required:**

   `message=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Message created", "message_id": <message_id>}`

* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"success": 0, "message": "Topic does not exist"}`

  OR
  
  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/topics/:topic_id/messages', {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth-token': <token>
        },
        body: new FormData(postData)
    });
  ```
