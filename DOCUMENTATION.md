**Show Punishments**

Returns all punishments from database

* **URL**
  /punishments

* **Method**
  `GET`

*   **URL Params**
    **Required**
    None
    **Optional**
    `recent=[boolean]`

*   **Data Params**
    None

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "id": 1,
                      "name": "HackerBro79",
                      "reason": "Hacking Bro",
                      "proof": "https://www.youtube.com/somevideo"
                      "punished_by": "SomeAdmin",
                      "removed_by": "",
                      "active": true,
                      "expires": "2020-03-18T00:40:15.434Z",
                      "date_punished": "2020-03-17T22:40:16.145Z"
                      "updated": null
                    },
                    {
                      "id": 2,
                      "name": "MegaHax88",
                      "reason": "Had some Mega hax",
                      "proof": "https://www.youtube.com/someothervideo"
                      "punished_by": "SomeOtherAdmin",
                      "removed_by": "SomeAdmin",
                      "active": false,
                      "expires": null,
                      "date_punished": "2020-03-17T22:40:16.145Z"
                      "updated": null
                    },
                  ]
                 `
**Post Punishment**

Adds a new punishment to the database

* **URL**
  /punishments

* **Method**
  `POST`

*   **URL Params**
    None

*   **Data Params**
    **Required**
    `name:[string]' <br />
    `reason:[string]` <br />
    `punished_by:[string]` <br />
    `expires:[timestamp]`
    **Optional**
    `proof:[url]` <br />

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "id": 1,
                      "name": "HackerBro79",
                      "reason": "Hacking Bro",
                      "proof": "No Proof Uploaded"
                      "punished_by": "SomeAdmin",
                      "removed_by": "",
                      "active": true,
                      "expires": "2020-03-30T00:40:15.434Z",
                      "date_punished": "2020-03-21T00:51:17.778Z"
                      "updated": null
                    }
                  ]
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`

**Get Punishment**

Gets a specified punishment from the database

* **URL**
  /punishments/:punishmentId

* **Method**
  `GET`

*   **URL Params**
    **Required**
    `:punishmentId[id]`

*   **Data Params**
    None

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "id": 1,
                      "name": "HackerBro79",
                      "reason": "Hacking Bro",
                      "proof": "No Proof Uploaded"
                      "punished_by": "SomeAdmin",
                      "removed_by": "",
                      "active": true,
                      "expires": "2020-03-30T00:40:15.434Z",
                      "date_punished": "2020-03-21T00:51:17.778Z"
                      "updated": null
                    }
                  ]
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not FOund**
    `{ "error": "Punishment doesn't exist" }`

**Update Punishment**

Updates a specified punishment in the DB

* **URL**
  /punishments/:punishmentId

* **Method**
  `PATCH`

*   **URL Params**
    **Required**
    `:punishmentId[id]`

*   **Data Params**
    **Required**

    **Optional**
    `name[string]` <br />
    `reason[string]` <br />
    `proof[url]` <br />
    `punished_by[string]` <br />
    `removed_by[string]` <br />
    `active[boolean]` <br />

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "id": 1,
                      "name": "HackerBro79",
                      "reason": "Hacking Bro",
                      "proof": "No Proof Uploaded"
                      "punished_by": "SomeAdmin",
                      "removed_by": "",
                      "active": false,
                      "expires": "2020-03-30T00:40:15.434Z",
                      "date_punished": "2020-03-21T00:51:17.778Z"
                      "updated": null
                    }
                  ]
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not Found**
    `{ "error": "Punishment doesn't exist" }`