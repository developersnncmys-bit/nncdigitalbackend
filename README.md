# NNC Digital — Backend API

Fresh Node.js + Express + MongoDB (Mongoose) API for the NNC Digital admin
panel and the public website (https://nncdigital.co.in). MVC layout:
`models/`, `controllers/`, `routes/`.

## Setup

```bash
cd backend
npm install
npm run dev      # nodemon, or: npm start
```

Config lives in `.env` (already filled with the Atlas connection string).
On first boot a default admin is created from the `SEED_ADMIN_*` vars:

- username: `admin`
- password: `admin123`  ← change this in `.env` before real use

## Endpoints

Base URL: `/api`

### Public (website)
| Method | Path                     | Purpose                                  |
|--------|--------------------------|------------------------------------------|
| POST   | `/website-enquiry`       | Website form → creates a "website" lead  |
| GET    | `/blogs/published`       | Published blogs                          |
| GET    | `/blogs/:idOrSlug`       | Single blog                              |
| GET    | `/careers/open`          | Open positions                          |
| GET    | `/careers/:idOrSlug`     | Single position                          |
| GET    | `/health`                | Health check                            |

### Auth
| Method | Path             | Purpose                          |
|--------|------------------|----------------------------------|
| POST   | `/auth/login`    | `{ username, password }` → token |
| GET    | `/auth/me`       | Current user (Bearer token)      |

### Admin (Bearer token required)
| Resource | Routes                                                        |
|----------|--------------------------------------------------------------|
| Leads    | `GET /leads`, `GET /leads/stats`, `GET/POST /leads`, `GET/PUT/DELETE /leads/:id`, `POST /leads/:id/notes` |
| Users    | `GET/POST /users`, `GET/PUT/DELETE /users/:id`  (admin only)  |
| Blogs    | `GET/POST /blogs`, `PUT/DELETE /blogs/:id`                    |
| Careers  | `GET/POST /careers`, `PUT/DELETE /careers/:id`               |

Send the token as `Authorization: Bearer <token>`.

## How the website connects

The website form already POSTs to `/api/website-enquiry` with
`{ name, phone, email, company, requirements, service, site, landingPage }`.
That handler stores each submission as a lead with `status: "new"` and
`leadType: "website"`, so it lands in the admin panel's **New Leads** pipeline.
Only the deploy URL in the website's fetch call needs to point at this backend.

## Deploy

Any Node host (Render, Railway, VPS). Set the same env vars there, use
`npm start`, and point both the website and the admin panel's `NEXT_PUBLIC_API_URL`
at the deployed URL.
