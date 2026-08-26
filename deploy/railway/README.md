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
5. Open **Variables** and add the documented values individually. Avoid the Raw
   Editor when unrelated secrets are already present.
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
RETHINKDB_IDLE_TIMEOUT_MS=30000
RETHINKDB_INIT_MAX_ATTEMPTS=6
RETHINKDB_INIT_RETRY_MS=500
RETHINKDB_INIT_MAX_RETRY_MS=5000
SHUTDOWN_TIMEOUT_MS=10000
VITE_COLD_START_RETRY_MS=1500
JWT_ACCESS_SECRET=<a-long-random-secret>
JWT_REFRESH_SECRET=<a-different-long-random-secret>
SESSION_HOURS=2
CORS_ORIGIN=https://<your-generated-railway-domain>
```

The HTTP process listens before the database is available. Database setup is
idempotent, memoized, and bounded to six exponentially delayed attempts. A
later API request starts a new bounded attempt after a failed sequence. The
driver uses one lazy shared connection, disables pings, and closes the socket
after 30 seconds without an active query.

## 3. Enable continuous deployment

In the `programming-focused-app` Railway service settings:

1. Keep GitHub autodeploy enabled for `main`.
2. Enable **Wait for CI** so deployment starts only after
   `.github/workflows/ci.yml` succeeds.
3. Keep the health check path `/api/health`; it is also declared in
   `/railway.json`.

## 4. Enable Serverless for the web service

After a successful deployment, open only the `programming-focused-app` service:

**Service -> Settings -> Deploy -> Serverless -> Enable Serverless**

Do not enable Serverless on `rethinkdb`. It is a continuously available
database with a persistent volume. The application service is request-driven
and safe to sleep; the database service is not.

Use `/api/health` for deployment health checks. `/api/ready` reports database
initialization and current connection state without opening a connection or
querying RethinkDB. A `connected: false` response remains ready after successful
initialization because the idle connection is intentionally released.

## Cost profile

- Keep the combined frontend/API in one service; Express already serves the
  compiled Vite application and splitting it would add an idle service.
- Start with one web replica and one database replica. A small installation can
  evaluate 0.5 vCPU and 512 MB for each service, but change limits only after
  checking Railway memory, CPU, and disk metrics.
- Serverless can remove idle web-service compute. RethinkDB compute and its
  persistent volume remain continuously billable.
- Private-network database traffic counts as service activity. With pings and
  pooling removed, only real requests and bounded initialization create that
  traffic.
- Cold starts can briefly produce 502/503/504 responses. The frontend retries
  one idempotent request after `VITE_COLD_START_RETRY_MS`; it never retries
  writes.
- Configure Railway usage alerts. Exact savings depend on observed metrics and
  cannot be guaranteed from repository configuration alone.

No worker, queue poller, cron task, changefeed, analytics client, telemetry
sender, external API poller, or service-to-service health poller exists in this
repository. The only timers are request/session UI timers, the unreferenced
database idle-close timer, bounded initialization delays, and a shutdown-only
deadline.

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
