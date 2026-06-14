# Parked platform kernel

Status: parked historical experiment, preserved here on 2026-06-14.

This folder is the canonical copy of the one-command provisioning kernel that
used to live in `rashidazarang/notion-to-site-platform`.

The kernel proved one idea: given a starter theme, a site name, and Notion
credentials, a script can generate a GitHub repo from the starter template,
create a Vercel project, set environment variables, deploy production, and
return the live URL.

That proof generated `rashidazarang/nts-kernel-demo`.

## Current direction

`notion-to-site` is a tool you own, not a hosted platform. The active work is
the library, the CLI, the public starter, docs, themes, and real usage.

Do not extend this kernel unless the platform path is explicitly reopened. If it
does come back, promote this into a tested `nts deploy` command or a dedicated
package inside this repository instead of reviving a separate platform repo.

## Usage snapshot

```bash
VERCEL_TOKEN=... VERCEL_TEAM=team_... \
NOTION_API_KEY=ntn_... NOTION_DATABASE_ID=... \
node experiments/platform-kernel/provision.mjs \
  --name my-site \
  --theme rashidazarang/notion-to-site-starter
```

`GITHUB_TOKEN` is optional when the GitHub CLI is already authenticated. The
script falls back to `gh auth token`.

## Lineage

- Original repo: `rashidazarang/notion-to-site-platform`
- Proof repo: `rashidazarang/nts-kernel-demo`
- Canonical repo: `rashidazarang/notion-to-site`

