# Album Browser

Angular SPA for Web Development Lab 6. The app demonstrates routing, HTTP requests,
Observables, and a shared service layer using the JSONPlaceholder API.

## Features

- Home, About, Albums, Album Detail, and Album Photos pages
- Angular Router with redirects and route parameters
- AlbumService for all API communication
- Read, update, and delete album flows
- Responsive photo grid and loading states

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Notes

- The app uses `https://jsonplaceholder.typicode.com`.
- JSONPlaceholder simulates `PUT` and `DELETE` requests, so UI updates are handled locally after success responses.
- Update the student name in the About page before submission if needed.
