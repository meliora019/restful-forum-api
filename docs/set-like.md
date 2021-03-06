**Set like**
----
Sets like to the message.

* **URL**

    /messages/:message_id/like

* **Method:**

    `PUT`

*  **URL Params**

   **Required:**

   `message_id=[string]`

* **Data Params**

    none

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Like set"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "success": 0, "message" : "Message does not exist" }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ "success": 0, "message" : "You have already liked this message" }`

  OR
  
  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/messages/:message_id/like', {
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'auth-token': <token>
        }
    });
  ```
