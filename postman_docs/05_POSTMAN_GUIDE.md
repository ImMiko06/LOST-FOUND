# POSTMAN GUIDE

## Folder

This folder contains request examples for the `LOST&FOUND KBTU` backend.

## Recommended order in Postman

1. `Register`
2. `Login`
3. Copy `access` and `refresh` tokens
4. `Get Categories`
5. `Get All Items`
6. `Get My Items`
7. `Create Item`
8. `Get Item Detail`
9. `Update Item`
10. `Create Claim`
11. `Logout`

## Base URLs

- Local backend: `http://127.0.0.1:8000/api`
- Render backend: `https://lost-found-jrlh.onrender.com/api`

## Important notes

- Protected endpoints need `Authorization: Bearer <accessToken>`
- `Create Item` uses `form-data`
- `Update Item` uses JSON
- You can still import the ready Postman collection from:
  - `backend/LOSTFOUND_KBTU.postman_collection.json`
