# zytekaron.com
My personal website, served at **zyte.dev** and **zytekaron.com**.

## Development

Install the existing dependencies with `npm ci`, then use `npm run start:dev`.
The Express server reads `HOSTNAME` and `PORT` from the environment or `.env`.
For example: `HOSTNAME=127.0.0.1 PORT=3000 npm run start:dev`.

## Content

- `cms/content/`: homepage, biography, and project introduction (Markdown).
- `cms/projects.config.json`: projects; `hide` controls visibility and `pinned` selects homepage entries.
- `cms/referrals.config.json`: referral destinations and descriptions.
- `cms/site.config.json`: navigation, social links, avatar, and error messages. Hidden navigation items can be restored by removing `hide`.
- `views/` and `public/styles/`: page templates and the shared visual design.

The existing Docs navigation item is hidden because `/docs` has no implementation and returned an error on the live site. Restore it when documentation is available.

The profile's birth date and time zone live in `cms/site.config.json`. Age is calculated at request/build time and refreshed in the browser, so the static preview stays current on future birthdays. The About page displays the age; it does not display the full birth date.

For referral changes, just ask for a link to be added, changed, hidden, or reordered. No account, dashboard, or extra service is needed: `cms/referrals.config.json` is the source of truth, and changes are committed and deployed with the website.

Referral entries use `name`, `body`, and `href`; set `hide: true` to hide an entry, or change the array order to reorder the page. The server reads this file at startup. Rebuild and recreate the container after an edit.

## Validation and deployment

`npm test` checks the public routes, local links and assets, and error handling.
Use `SITE_TEST_ORIGIN=https://zyte.dev npm test` to run the same checks against a deployed site.
`npm run build` exports the EJS pages and public assets to `dist/` for static hosting.
The static export includes a 404 fallback; query-specific `/error?code=…` pages and safe return links remain available in the Express runtime.

### Docker

Production runs the Express server in Docker from `/srv/zytekaron.com` on `inf` (`infinity.zyte.dev`). The container uses Node 24, runs as an unprivileged user with a read-only filesystem, and sends logs to Docker with bounded rotation. No environment file or secrets are required.

```sh
cd /srv/zytekaron.com
docker compose up -d --build --wait
docker compose ps
docker compose logs --tail=100 website
```

The application listens only on the host's loopback interface at port 3000. The host's reverse proxy handles HTTPS for `zyte.dev` and `zytekaron.com`. To use a different upstream port, set `WEBSITE_PORT` when running Compose; use that same port in the proxy configuration.

For updates, pull the repository's `master` branch in the server deployment directory and rerun `docker compose up -d --build --wait`. This includes referral edits. The image contains the content, so restarting an old image alone does not apply new files.

```sh
ssh inf
cd /srv/zytekaron.com
git pull --ff-only origin master
docker compose up -d --build --wait
```

The Sites manifest configures a separate, private static review site. It is independent of production on `inf`.

## Contributors
- Agradip - [GitHub](https://github.com/Agradip335)

## License
**zytekaron.com** is licensed under the [MIT License](./LICENSE)
