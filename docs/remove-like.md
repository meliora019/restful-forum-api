**Remove like**
----
Removes like from the message.

* **URL**

    /messages/:message_id/like

* **Method:**

    `DELETE`

*  **URL Params**

   **Required:**

   `message_id=[string]`

* **Data Params**

    none

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "message": "Like removed"}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "success": 0, "message" : "Message does not exist" }`

  OR
  
  * **Code:** 403 FORBIDDEN <br />


* **Sample Call:**

  ```javascript
    let response = await fetch('/messages/:message_id/like', {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {
            'auth-token': <token>
        }
    });
  ```
