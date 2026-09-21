# Deployment

Import this GitHub repository into Vercel using https://vercel.com/new.

- Framework preset: Other
- Root directory: repository root
- Output directory: dist
- Build command: empty
- Install command: empty
- Environment variables: none

The included vercel.json configures the static output. All game assets live in dist/ and use relative paths. No server or package installation is needed.

Browser progress is stored per origin. Moving to a new domain starts a separate local save; the previous save remains on the old domain.
