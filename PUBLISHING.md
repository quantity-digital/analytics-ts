# Publishing to npm

Releases are published by `.github/workflows/publish.yml` whenever a version
tag such as `v1.1.0` is pushed. The workflow uses npm trusted publishing (OIDC),
so it does not need a long-lived npm token in GitHub.

## One-time setup

1. Sign in to npm and enable two-factor authentication on the maintainer
   account.
2. Create the `quantity-digital` npm organization, or make sure you have package
   publishing permission in the existing organization. The free public-package
   plan is sufficient for this public package.
3. Create a GitHub deployment environment named `npm` under **Repository
   settings > Environments**. Optionally add required reviewers to make
   publishing require approval.
4. Bootstrap the package with one manual publish because npm only exposes
   trusted-publisher settings after the package exists. From an exact release
   tag, run:

   ```sh
   git switch --detach v1.0.1
   npm login
   npm ci
   npm publish --access public
   git switch main
   ```

   `v1.0.1` is the existing release tag. Do this bootstrap after the publishing
   workflow has been merged into `main`, but before pushing any newer version
   tag that should invoke the workflow.
5. Open the package on npm, go to **Settings > Trusted Publisher**, choose
   **GitHub Actions**, and enter:

   - Organization or user: `quantity-digital`
   - Repository: `analytics-ts`
   - Workflow filename: `publish.yml`
   - Environment: `npm`
   - Allowed action: `npm publish`

6. After the first successful automated release, configure the package to
   disallow token-based publishing and remove any publish tokens that are no
   longer needed. Trusted publishing continues to work.

## Creating a release

Start from a clean, up-to-date `main` branch, then run:

```sh
npm ci
npm run build
npm run release:dry-run
npm run release
git push --follow-tags origin main
```

`commit-and-tag-version` determines the next version from conventional commits,
updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, creates the
release commit, and tags it. The pushed `vX.Y.Z` tag starts the publish workflow.

Before pushing, verify that the generated release commit and version are what
you intended. npm versions are immutable after publication.
