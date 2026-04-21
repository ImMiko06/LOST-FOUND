# LOST&FOUND KBTU

Modern Angular + Django/DRF web application for publishing lost and found items inside the university.

## Main Features

- JWT login and logout
- Register new users
- Create, edit, delete, and browse lost/found posts
- Upload item photos directly from device only
- Search by title
- Filter by category
- My Posts page for the authenticated user
- Claim request form for returning items
- Responsive UI for laptop and phone

## Project Structure

- `frontend/` - Angular application
- `backend/` - Django + DRF API

## Backend Run

Use the available Python runtime:

```powershell
& 'C:\Program Files\PostgreSQL\17\pgAdmin 4\python\python.exe' manage.py runserver
```

Run it from:

```powershell
C:\Users\Acer Nitro V15\Desktop\LOSTFOUND\backend
```

## Frontend Run

Because the original folder name contains `&`, it is safer to run frontend commands through this helper path:

```powershell
C:\Users\Acer Nitro V15\Desktop\LOSTFOUND\frontend
```

Install dependencies:

```powershell
cmd /c npm.cmd install
```

Start dev server:

```powershell
cmd /c npm.cmd start
```

## API Files

- Postman collection: `backend/LOSTFOUND_KBTU.postman_collection.json`
- Backend dependencies: `backend/requirements.txt`

## Core Models

- `User`
- `Category`
- `ItemPost`
- `ClaimRequest`

## Public Deployment

Recommended setup:

- `frontend` -> Netlify
- `backend` -> Render

### Backend on Render

Use the `backend/` folder or the included `render.yaml`.

Important environment variables:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=your-render-service.onrender.com`
- `CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app`
- `CSRF_TRUSTED_ORIGINS=https://your-netlify-site.netlify.app`

Start command:

```text
gunicorn shop_back.wsgi:application
```

### Frontend on Netlify

The frontend already includes `netlify.toml`.

Before final deploy, update this file:

- `frontend/src/app/core/api.config.ts`

Replace:

```ts
https://your-render-backend.onrender.com/api
```

with your real Render backend URL.

Then deploy the `frontend/` folder to Netlify.
