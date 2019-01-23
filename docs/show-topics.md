**Show topics**
----
Show forum topics with pagination.

* **URL**

    /topics

* **Method:**

    `GET`

*  **URL Params**

   none

* **Data Params**

    **Optional:**

   `offset=[integer] (default value = 0)`
   
   `limit=[integer] (default value = 10)`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"success": 1, "topics": <[topics]>}`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"success": 0, "message": "not valid parameters"}`


* **Sample Call:**

  ```javascript
    let response = await fetch('/topics?offset=5&limit=5', {
        credentials: 'same-origin',
        method: 'GET'
    });
  ```
