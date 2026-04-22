# CLAIM REQUESTS

## Get Claims

- Method: `GET`
- URL: `http://127.0.0.1:8000/api/claims/`
- Headers:
  - `Authorization: Bearer <accessToken>`

## Create Claim

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/claims/`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>`
- Body:

```json
{
  "item": 12,
  "message": "This item belongs to me. I can describe the inside details.",
  "contact_info": "WhatsApp: +7 700 000 0000"
}
```
