#!/usr/bin/env node
/**
 * Parked notion-to-site provisioning kernel.
 *
 * Turns { theme, name, Notion DB } into a live, user-owned site:
 *   1. Generate a new GitHub repo from a starter theme template.
 *   2. Create a Vercel project with the Next.js framework preset.
 *   3. Set NOTION_API_KEY and NOTION_DATABASE_ID.
 *   4. Deploy to production from a local clone.
 *   5. Return { repoUrl, projectId, url }.
 *
 * This is preserved as historical proof, not active product surface.
 *
 * Usage:
 *   GITHUB_TOKEN=...(or gh auth) VERCEL_TOKEN=... VERCEL_TEAM=... \
 *   NOTION_API_KEY=... NOTION_DATABASE_ID=... \
 *   node experiments/platform-kernel/provision.mjs --name my-site \
 *     [--theme rashidazarang/notion-to-site-starter] [--owner rashidazarang] \
 *     [--dry-run]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1
    ? process.argv[i + 1]?.startsWith("--")
      ? true
      : process.argv[i + 1]
    : fallback;
}

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  });

const NAME = arg("--name");
const THEME = arg("--theme", "rashidazarang/notion-to-site-starter");
const OWNER = arg("--owner", "rashidazarang");
const DRY = process.argv.includes("--dry-run");

if (!NAME) {
  console.error("Missing --name");
  process.exit(1);
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
let VERCEL_TOKEN;
let VERCEL_TEAM;

const vercel = (method, path, body) =>
  fetch(
    `https://api.vercel.com${path}${
      path.includes("?") ? "&" : "?"
    }teamId=${VERCEL_TEAM}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  ).then(async (r) => {
    const t = await r.text();
    let j;
    try {
      j = JSON.parse(t);
    } catch {
      j = t;
    }
    if (!r.ok) {
      throw new Error(`Vercel ${method} ${path} -> ${r.status}: ${t.slice(0, 300)}`);
    }
    return j;
  });

const log = (message) => console.log(message);

async function main() {
  log(`\nProvisioning "${NAME}" from theme ${THEME}${DRY ? " (dry run)" : ""}`);
  if (DRY) {
    log("would: generate repo, create Vercel project, set env, deploy");
    log(
      JSON.stringify(
        {
          name: NAME,
          theme: THEME,
          owner: OWNER,
          db: NOTION_DATABASE_ID ? "set" : "missing",
        },
        null,
        2,
      ),
    );
    return;
  }

  const GH_TOKEN = process.env.GITHUB_TOKEN || sh("gh", ["auth", "token"]).trim();
  VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  VERCEL_TEAM = process.env.VERCEL_TEAM;

  if (!VERCEL_TOKEN || !VERCEL_TEAM) {
    console.error("Missing VERCEL_TOKEN / VERCEL_TEAM");
    process.exit(1);
  }

  log("1/5 generating GitHub repo from template");
  const gen = JSON.parse(
    sh("gh", [
      "api",
      "-X",
      "POST",
      `repos/${THEME}/generate`,
      "-f",
      `owner=${OWNER}`,
      "-f",
      `name=${NAME}`,
      "-F",
      "private=false",
    ]),
  );
  const repoUrl = gen.html_url;
  const cloneUrl = gen.clone_url;
  log(`created ${repoUrl}`);

  log("waiting for repo to populate");
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const c = sh("gh", ["api", `repos/${OWNER}/${NAME}/contents/package.json`]);
      if (c.includes('"name"')) {
        ready = true;
        break;
      }
    } catch {
      // Template generation is async.
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (!ready) {
    throw new Error("repo did not populate from template in time");
  }

  log("2/5 creating Vercel project");
  const project = await vercel("POST", "/v10/projects", {
    name: NAME,
    framework: "nextjs",
  });
  await vercel("PATCH", `/v9/projects/${project.id}`, { ssoProtection: null });
  log(`project ${project.id}`);

  log("3/5 setting env vars");
  const envs = [
    ["NOTION_API_KEY", NOTION_API_KEY],
    ["NOTION_DATABASE_ID", NOTION_DATABASE_ID],
  ].filter(([, value]) => value);

  for (const [key, value] of envs) {
    await vercel("POST", `/v10/projects/${project.id}/env`, {
      key,
      value,
      type: "encrypted",
      target: ["production", "preview"],
    });
  }
  log(envs.map(([key]) => key).join(", ") || "(none)");

  log("4/5 cloning and deploying");
  const dir = mkdtempSync(join(tmpdir(), "nts-site-"));
  const repoDir = join(dir, NAME);
  sh("git", [
    "clone",
    "--depth",
    "1",
    cloneUrl.replace("https://", `https://x-access-token:${GH_TOKEN}@`),
    repoDir,
  ]);

  mkdirSync(join(repoDir, ".vercel"), { recursive: true });
  writeFileSync(
    join(repoDir, ".vercel", "project.json"),
    JSON.stringify({ projectId: project.id, orgId: VERCEL_TEAM }),
  );

  const deployOut = sh(
    "vercel",
    ["deploy", "--prod", "--yes", "--token", VERCEL_TOKEN, "--scope", VERCEL_TEAM],
    { cwd: repoDir },
  );
  const url = (deployOut.match(/https:\/\/[^\s]+\.vercel\.app/g) || []).pop() || "";
  rmSync(dir, { recursive: true, force: true });
  log("deployed");

  log("5/5 done\n");
  console.log(
    JSON.stringify(
      {
        repoUrl,
        projectId: project.id,
        url,
        alias: `https://${NAME}.vercel.app`,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("\nprovision failed:", e.message);
  process.exit(1);
});
