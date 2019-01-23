**Delete topic**
----
Deletes user's forum topic.

* **URL**

    /users/:user_id/topics/:topic_id

* **Method:**

    `DELETE`

*  **URL Params**

   **Required:**

   `user_id=[string]`
   `topic_id=[string]`

* **Data Params**

    none

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Topic deleted"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "success": 0, "message" : "Topic does not exist" }`

  OR
  
  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/users/:user_id/topics/:topic_id', {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {
            'auth-token': <token>
        }
    });
  ```
