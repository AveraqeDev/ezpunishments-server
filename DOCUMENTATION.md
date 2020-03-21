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