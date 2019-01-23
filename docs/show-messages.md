**Show messages**
----
Show forum topic's messages with pagination.

* **URL**

    /topics/:topic_id/messages

* **Method:**

    `GET`

*  **URL Params**

   **Required:**

   `topic_id=[string]`

* **Data Params**

    **Optional:**

   `offset=[integer] (default value = 0)`
   
   `limit=[integer] (default value = 10)`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "messages": <[messages]>}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"success": 0, "message": "not valid parameters"}`


* **Sample Call:**

  ```javascript
    let response = await fetch('/topics/:topic_id/messages?offset=5&limit=5', {
        credentials: 'same-origin',
        method: 'GET'
    });
  ```
