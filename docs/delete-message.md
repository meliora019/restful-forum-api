**Delete message**
----
Deletes forum topic's message.

* **URL**

    /users/:user_id/topics/:topic_id/messages/:message_id

* **Method:**

    `DELETE`

*  **URL Params**

   **Required:**

   `user_id=[string]`
   
   `topic_id=[string]`
   
   `message_id=[string]`

* **Data Params**

    none

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Message deleted"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "success": 0, "message" : "Message does not exist" }`

  OR

  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/topics/:topic_id/messages/:message_id', {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {
            'auth-token': <token>
        }
    });
  ```
