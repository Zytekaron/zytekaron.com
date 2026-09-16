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

## Validation and deployment

`npm test` checks the public routes, local links and assets, and error handling.
`npm run build` exports the EJS pages and public assets to `dist/` for static hosting.
The static export includes a 404 fallback; query-specific `/error?code=…` pages and safe return links remain available in the Express runtime.

The normal `npm start` deployment continues to use Express. The Sites manifest configures a separate, private static review site; it does not change either domain's DNS or existing deployment.

## Contributors
- Agradip - [GitHub](https://github.com/Agradip335)

## License
**zytekaron.com** is licensed under the [MIT License](./LICENSE)
