# AUTH REQUESTS

## Register

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/register/`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "username": "student_postman",
  "password": "12345678"
}
```

## Login

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/login/`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "username": "student789",
  "password": "12345678"
}
```

## Logout

- Method: `POST`
- URL: `http://127.0.0.1:8000/api/logout/`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>`
- Body:

```json
{
  "refresh": "<refreshToken>"
}
```
