# Punishments Documentation

## **Get Punishments**

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
                 ` <br /> <br />
## **Post Punishment**

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
    **Content:** `
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
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`<br /> <br />

## **Get Punishment**

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
    **Content:** `
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
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not FOund**
    `{ "error": "Punishment doesn't exist" }`<br /> <br />

## **Update Punishment**

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
    **Content:** `
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
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not Found**
    `{ "error": "Punishment doesn't exist" }`<br /> <br />

# Users Documentation

## **Get Users**

Returns all users from database

* **URL**
  /users

* **Method**
  `GET`

*   **URL Params**
    None

*   **Data Params**
    None

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `[
                    {
                      "id": 1,
                      "email": "someuser@email.com":
                      "user_name": "SomeUser",
                      "user_role": "member",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    },
                    {
                      "id": 2,
                      "email": "somestaff@email.com":
                      "user_name": "SomStaff",
                      "user_role": "staff",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    },
                    {
                      "id": 3,
                      "email": "someadmin@email.com":
                      "user_name": "SomeAdmin",
                      "user_role": "admin",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    },
                  ]
                 ` <br /> <br />
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`

## **Post User**

Register a new user

* **URL**
  /users

* **Method**
  `POST`

*   **URL Params**
    None

*   **Data Params**
    **Required**
    `email:[string]' <br />
    `user_name:[string]` <br />
    `password:[string]` <br />
    **Optional**
    None

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `
                    {
                      "id": 4,
                      "email": "newuser@email.com":
                      "user_name": "NewUser",
                      "user_role": "member",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    }
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`<br /> <br />

## **Get User**

Gets a specified user from the database

* **URL**
  /users/:userId

* **Method**
  `GET`

*   **URL Params**
    **Required**
    `:userId[integer]`

*   **Data Params**
    None

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `
                    {
                      "id": 1,
                      "email": "someuser@email.com":
                      "user_name": "SomeUser",
                      "user_role": "member",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    }
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not FOund**
    `{ "error": "User doesn't exist" }`<br /> <br />

## **Update User**

Updates a user's information in DB

* **URL**
  /users/:userId

* **Method**
  `PATCH`

*   **URL Params**
    **Required**
    `:userId[integer]`

*   **Data Params**
    **Required**

    **Optional**
    `user_name[string]` <br />
    `email[string]` <br />
    `user_role[url]` <br />

* **Success Response**
  * **Code:** 200 <br />
    **Content:** `
                    {
                      "id": 1,
                      "email": "updated@email.com":
                      "user_name": "UpdatedName",
                      "user_role": "staff",
                      "date_created": "2020-03-17T23:26:13.010Z"
                    }
                 `
* **Error Response**
  * **Unauthorized**
    `{ "error": "Unauthorized request" }`
  * **Not Found**
    `{ "error": "User doesn't exist" }`<br /> <br />