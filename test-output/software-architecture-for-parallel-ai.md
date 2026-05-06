---
id: software-architecture-for-parallel-ai
path: /blog/software-architecture-for-parallel-ai.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 26a52116-a8b1-8034-93f2-d4250cd7bdd1
meta:
  title: Software Architecture for Parallel AI
  author: Rashid Azarang
  category: []
  main_tag: null
  tags:
    - Featured
  featured: false
  featured_at:
    - Home Page
  language: English
  post_type: Post
  status: Not started
  comment: 'Date: September 10, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/3c38e540-2af8-45dc-b336-44a8af42d19c/imagess.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=5c74007e31a6aff085d79b9cd43fa73c8fb4518c16e9755852ed9d0a9b61ad6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Software Architecture for Parallel AI


[**← Go back**](http://rashidazarang.com/)


## **Designing Software Architecture for Parallel AI Sessions**


**Date:** September 10, 2025


To get the most out of Claude Code, we need to run multiple sessions in parallel. And yeah, that gets complex fast. So let's figure out how to structure our files and directories to actually make this work... plus the whole GitHub workflow thing.


![image](notion:26a52116-a8b1-80df-8d52-eba8ee5e26d0)


### **The Basic Idea: Worktrees Are Your Friend**


Okay, so here's the thing about parallel Claude sessions. Each one needs its own space to work. Git worktrees give you exactly that – think of them as separate copies of your project that somehow magically share the same history.


You can have five Claude sessions cranking away on five different features. All from the same repo. It's actually pretty wild when you see it working.


But wait, it gets better. Each session can spawn what I call sub-agents. Like, your main Claude working on authentication might spin up a helper just for database stuff, another one for tests, maybe one more for docs. The worktree setup naturally handles this whole hierarchy thing.


### **Setting Up Your Repository (The Right Way)**


First things first... you need to organize your code so these parallel sessions don't step all over each other. Here's what I've found works:


```plain text
/apps/
  web/
  admin/
  worker/
/packages/
  ui/
  auth/
  data/
/services/
  billing/
  notifications/
/platform/
  infra/
  scripts/
  schemas/
/agents/
  templates/
  contracts/
  tools/
```


Simple rule: stuff that changes together lives together. Everything else? Keep it separate. Each folder becomes a boundary – the auth Claude stays in auth, the UI Claude stays in UI. They don't even know each other exist.


That `/agents/` folder is special though. That's where you keep your templates for spawning sub-agents. More on that in a minute...


### **The Sub-Agent Thing (This Is Where It Gets Cool)**


So sub-agents. Think of them as Claude's little helpers. They're basically Claude sessions that your main Claude spawns to handle specific jobs. And they work within even tighter boundaries than their parent.


Let me give you a real example. Say you're building authentication. Your main Claude owns `/packages/auth/` but it spawns three helpers:

1. Migration buddy – only touches `/packages/auth/migrations/`
2. Test writer – stays in `/packages/auth/__tests__/`
3. API specialist – works in `/packages/auth/api/`

Each one gets its own little workspace inside the parent worktree:


```bash
../wt-auth-feature/
  packages/auth/          # Main Claude works here
  .sub-agents/
    migration/           # Helper 1's space
    testing/             # Helper 2's space
    api/                 # Helper 3's space
```


It's like... giving each assistant their own desk in the office. They can't mess with each other's stuff.


### **Actually Setting This Up (With Commands That Work)**


Creating a worktree with sub-agent support isn't hard. Really:


```bash
git worktree add ../wt-auth-feature -b feature/auth-hardening
cd ../wt-auth-feature
mkdir -p .sub-agents
```


For JavaScript projects, each workspace needs its own node_modules. (I learned this the hard way...)


```bash
cd ../wt-auth-feature
pnpm install

# For the sub-agents
cd .sub-agents/testing
ln -s ../../package.json .
pnpm install --filter "*test*"
```


Python? Same idea, different commands:


```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```


### **Docker Services (Because of Course You Need Them)**


If you're using Docker – and let's be honest, you probably are – each worktree needs its own containers. Here's the trick that took me forever to figure out:


```yaml
name: ${COMPOSE_PROJECT_NAME:-${PWD##*/}}
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${COMPOSE_PROJECT_NAME}_app
    ports:
      - "5432"

  # This one's just for tests
  test-db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${COMPOSE_PROJECT_NAME}_test
    ports:
      - "5433"
```


This automatically namespaces everything by the worktree directory. No conflicts. No "port already in use" errors. Just... works.


### **Writing Contracts (So Claude Knows What's What)**


Every Claude session needs boundaries. Crystal clear ones. I create a `SESSION.md` file in each worktree:


```markdown
# What This Session Can Do
- Modify: /packages/auth
- Don't touch: /services/*, /packages/ui
- Can spawn helpers: yes
- Max helpers: 3

# Helper Permissions
- migration-agent: /packages/auth/migrations/**
- test-agent: /packages/auth/__tests__/**
- api-agent: /packages/auth/api/**

# What We're Building
- All helpers finish their tasks
- Tests pass
- No wandering outside boundaries
```


It's like... giving someone renovation permissions for specific rooms in your house. "You can redo the kitchen, but don't touch the bathroom."


### **Making Sub-Agent Templates**


Store reusable contracts in `/agents/templates/`. These are like job descriptions for your helpers:


```markdown
# Test Writer Contract
## Your Job
- Write tests for: {{module}}
- Work in: {{module}}/__tests__/
- Coverage goal: 80%

## Rules
- Only create or edit test files
- Don't change the actual code
- Use existing test helpers

## You Can Read
- Source code: {{module}}/src/**
- Test utilities: /platform/testing/
```


### **Actually Spawning These Helpers**


Here's a script that makes spawning sub-agents dead simple:


```bash
#!/usr/bin/env bash
# spawn-helper.sh

HELPER_TYPE=$1  # like "test" or "migration"
PARENT_DIR=$(pwd)
SUB_DIR=".sub-agents/$HELPER_TYPE"

mkdir -p "$SUB_DIR"
cd "$SUB_DIR"

# Give it its contract
cp "/agents/templates/${HELPER_TYPE}-agent.md" "./CONTRACT.md"

echo "Starting helper: $HELPER_TYPE"
claude-code --contract CONTRACT.md
```


### **Keeping Everyone Coordinated**


The main Claude needs to know what its helpers are doing. I use a simple coordination file:


```yaml
# .sub-agents/status.yaml
helpers:
  migration:
    status: working
    task: "Adding user_roles table"
    started: 10 minutes ago

  test:
    status: done
    task: "Auth service tests"
    coverage: 85%

  api:
    status: waiting
    task: "Update OpenAPI spec"
    waiting_for: migration
```


### **Making Sure Nobody Colors Outside the Lines**


This is crucial. You need automatic guards. Here's a pre-commit hook that's saved my bacon more times than I can count:


```bash
#!/usr/bin/env bash
ALLOWED=.allowed-paths

if [ -f "$ALLOWED" ]; then
  violations=$(git diff --cached --name-only | grep -v -f "$ALLOWED" || true)
  if [ -n "$violations" ]; then
    echo "Whoa! You're changing files outside your area:"
    echo "$violations"
    exit 1
  fi
fi
```


### **How Helpers Talk to Each Other**


Sub-agents don't modify each other's code directly. They leave messages:


```yaml
# .sub-agents/messages/migration-done.yaml
from: migration
to: test
message: "New user_roles table is ready"
what_changed:
  - User model now has roles
  - Check the new schema version
```


The main Claude watches these messages and coordinates responses. It's like... being a manager who actually reads their emails.


### **Your Daily Workflow (What This Actually Looks Like)**


Here's how I work with this setup every day:


Morning: Spin up worktrees for today's tasks


```bash
./platform/scripts/wt-new-with-agents auth-feature "test,migration"
./platform/scripts/wt-new-with-agents ui-polish "test,docs"
```


Start main Claudes:


```bash
cd ../wt-auth-feature
claude-code
```


Let them spawn helpers as needed. Check in periodically:


```bash
./check-status.sh  # Shows what everyone's doing
```


When stuff's done, merge it:


```bash
git push origin feature/auth-feature
# Make PR, review, merge
```


Clean up:


```bash
./platform/scripts/wt-rm ../wt-auth-feature
```


### **Different Types of Helpers (And When to Use Them)**


I've found certain patterns work really well:


**Test Writer**: Just writes tests. Nothing else.

- Lives in `__tests__/`
- Reads source code
- Can't change functionality

**Doc Updater**: Keeps documentation in sync

- Updates READMEs
- Fixes comments
- Updates API docs

**Refactorer**: Makes code prettier without breaking it

- Runs linters
- Applies consistent formatting
- Simplifies complex functions

**Performance Tuner**: Makes specific code faster

- Profiles bottlenecks
- Optimizes algorithms
- Never changes APIs

### **The Hierarchy Thing (Don't Go Crazy)**


Helpers can have helpers. But... don't go nuts. I've tried four levels deep and it's a mess. Three levels max:


```plain text
Main Claude: Building the feature
├── Helper: API design
│   └── Sub-helper: Generate types
├── Helper: Implementation
│   └── Sub-helper: Database queries
└── Helper: Testing
    └── Sub-helper: Test data setup
```


Each level gets tighter boundaries. It's like Russian nesting dolls, but with permissions.


### **Making CI/CD Not Explode**


With all these agents making commits, your CI needs to be smart:


```yaml
# Only run what's needed
name: Smart CI
on:
  push:
    paths:
      - '**/__tests__/**'  # Test changes
      - '**/migrations/**' # Database changes

jobs:
  quick-check:
    # Just run affected tests
    run: pnpm test --changed
```


### **Watching Everything (Without Going Insane)**


I have a simple script that shows me what's happening:


```bash
#!/usr/bin/env bash
echo "=== Who's Working on What ==="

for worktree in $(git worktree list --porcelain | grep "^worktree"); do
  # Show main Claude
  echo "Main: $(basename $worktree)"

  # Show helpers
  if [ -d "$worktree/.sub-agents" ]; then
    ls -la "$worktree/.sub-agents" | grep ^d
  fi
done
```


### **Common Mistakes (That I've Made So You Don't Have To)**


Too many tiny helpers. If a task takes less than 15 minutes, just let the main Claude do it.


Circular dependencies. Helper A waits for Helper B waits for Helper A. Dead in the water.


No timeouts. Sometimes helpers get stuck. Auto-kill them after an hour.


Forgetting boundaries. That's why the automated guards are mandatory, not optional.


### **The Checklist (Before You Start)**


Before you dive into this:

- [ ] Your repo has clear module boundaries
- [ ] Helper templates exist in `/agents/templates/`
- [ ] You have coordination files set up
- [ ] Message passing works
- [ ] Boundary guards are in place
- [ ] CI won't freak out
- [ ] You can monitor everything
- [ ] Cleanup scripts exist

### **Why This Actually Matters**


Look, I've been doing this for a while now. The difference is... staggering. It's not just about speed (though yeah, shipping 5x faster is nice). It's about being able to tackle complex stuff that would normally need a whole team.


You become less of a coder and more of a conductor. You're orchestrating these specialized helpers, each doing what they're best at. The test writer writes better tests than I do. The doc helper never forgets to update the README. The refactorer catches stuff I'd miss.


Start simple. Two parallel sessions. Once that feels natural, add a helper or two. Before you know it, you're running a whole symphony of Claude sessions, each playing their part perfectly.


The future isn't just AI helping you code. It's you conducting an orchestra of specialized AI agents, each focused on what they do best. And honestly? It's kind of amazing to watch it all come together.


---


## More about me


My aim is to live a balanced and meaningful life, where all areas of my life are in harmony. By living this way, I can be the best version of myself and make a positive difference in the world.

Professionally, I focus on the design and implementation of cognitive infrastructure: systems that make complex enterprise data usable through AI-powered tools and human-like interaction.



[**About me →**](https://rashidazarang.com/personal)


---


## Similar blog posts


Untitled


---

