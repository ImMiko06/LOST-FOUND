# ITEM CRUD REQUESTS

## Create Item

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/items/`
- Headers:
  - `Authorization: Bearer <accessToken>`
- Body type: `form-data`

Fields:

- `title`: `Black wallet`
- `description`: `Found near the KBTU cafeteria.`
- `item_type`: `found`
- `location`: `KBTU cafeteria`
- `event_date`: `2026-04-22`
- `contact_info`: `Telegram: @student789`
- `status`: `active`
- `category`: `3`
- `image`: file optional

## Update Item

- Method: `PUT`
- URL: `http://127.0.0.1:8000/api/items/12/`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>`
- Body:

```json
{
  "title": "Black wallet updated",
  "description": "Found near the KBTU cafeteria. Updated from Postman.",
  "item_type": "found",
  "location": "KBTU cafeteria",
  "event_date": "2026-04-22",
  "image_url": "",
  "contact_info": "Telegram: @student789",
  "status": "active",
  "category": 3
}
```

## Delete Item

- Method: `DELETE`
- URL: `http://127.0.0.1:8000/api/items/12/`
- Headers:
  - `Authorization: Bearer <accessToken>`

## Get My Items

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/my-items/`
- Headers:
  - `Authorization: Bearer <accessToken>`
