# Railway deployment

Production uses two Railway services in one project:

- `programming-focused-app`: this GitHub repository, built from the root
  `Dockerfile`.
- `rethinkdb`: the public image `rethinkdb:2.4.4-bookworm-slim`, with a
  persistent Railway volume.

Railway automatically deploys `main` only after the GitHub Actions CI workflow
succeeds.

## 1. Create the RethinkDB service

1. Create or open the Railway project.
2. Add a service from the Docker image
   `rethinkdb:2.4.4-bookworm-slim`.
3. Name the service exactly `rethinkdb`.
4. Attach a persistent Railway volume mounted at `/data`.
5. Do not create a public domain or TCP proxy for this service.
6. Confirm in its logs that RethinkDB is listening before deploying the app.

The database must be a separate service tile in the same Railway project and
environment as the app. The application connects through Railway private
networking:

```dotenv
RETHINKDB_SERVERS=rethinkdb.railway.internal:28015
```

Use that exact plain-text value. Do not use an empty hostname or an unresolved
Railway variable reference.

## 2. Create the application service

1. Add a service from this GitHub repository.
2. Name it `programming-focused-app`.
3. Select the `main` branch and keep the repository root directory `/`.
4. Railway reads `/railway.json` and builds `/Dockerfile`.
5. Open **Variables -> RAW Editor** and paste the values from
   `variables.example.env`.
6. Generate a public Railway domain for the app.
7. Set `CORS_ORIGIN` to that exact HTTPS domain and redeploy.

Do not configure `PORT`; Railway injects it automatically. The required
application variables are:

```dotenv
NODE_ENV=production
RETHINKDB_SERVERS=rethinkdb.railway.internal:28015
RETHINKDB_DB=programming_focused
RETHINKDB_USER=admin
RETHINKDB_TIMEOUT=20
RETHINKDB_INIT_MAX_ATTEMPTS=60
RETHINKDB_INIT_RETRY_MS=2000
JWT_ACCESS_SECRET=<a-long-random-secret>
JWT_REFRESH_SECRET=<a-different-long-random-secret>
SESSION_HOURS=2
CORS_ORIGIN=https://<your-generated-railway-domain>
```

The backend initializes the database, tables, and indexes idempotently at
startup. A separate migration job is not required.

## 3. Enable continuous deployment

In the `programming-focused-app` Railway service settings:

1. Keep GitHub autodeploy enabled for `main`.
2. Enable **Wait for CI** so deployment starts only after
   `.github/workflows/ci.yml` succeeds.
3. Keep the health check path `/api/health`; it is also declared in
   `/railway.json`.

The release flow is:

```text
GitHub push -> CI checks -> Railway image build -> health check -> live deployment
```

## Troubleshooting

If the application cannot connect to RethinkDB:

1. Confirm the second service is named exactly `rethinkdb`.
2. Confirm both services are in the same Railway project and environment.
3. Confirm the database uses `rethinkdb:2.4.4-bookworm-slim`.
4. Confirm its volume is mounted at `/data`.
5. Re-enter `RETHINKDB_SERVERS` as the plain-text value
   `rethinkdb.railway.internal:28015`.
6. Redeploy the app after changing staged Railway variables.

Common errors:

- `ENOTFOUND` or `EAI_AGAIN`: incorrect service name or environment.
- `ECONNREFUSED`: the database service is not ready.
- Authentication error: app and database credentials differ.

`backend/docker-compose.yml` is only for local development and is not used by
Railway.
