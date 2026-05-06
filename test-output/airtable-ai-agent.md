---
id: airtable-ai-agent
path: /blog/airtable-ai-agent.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 25152116-a8b1-806a-b95c-de52b2ff6a39
meta:
  title: Airtable AI Agent
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: false
  featured_at:
    - Home Page
  language: English
  post_type: Post
  status: Not started
  comment: 'Date: August 15, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/0bfead12-5797-4b74-8806-2a9dcaedd727/hjgj.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=68b82da5852a0a13eaa9e28f5471f4e8d12d39b2dc6d5087ea576eb56fc94059&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Airtable AI Agent


[← Go back](/86c9f77657a2461ba3e5f2d8fccdcf04)


# Airtable AI Agent


**Date:** August 15, 2025


_I built an MCP to talk to my database. Then it evolved._


![image](notion:25152116-a8b1-8012-a810-ff952538984e)


I use Airtable for everything. Project tracking, CRM, content calendar, inventory. It's the best relational database for persoal use; visual, powerful, actually fun to use.


But I kept losing focus. Middle of writing, need a number, switch tabs, find the base, click through views, find the data, switch back. The context switching was killing my flow.


So I built an MCP (Model Context Protocol) that lets me talk to Airtable without leaving my editor.


```plain text
Me: "What's the status on the API docs?"
Claude: "In review since Tuesday, assigned to Sarah, due tomorrow."
```


Simple. No tab switching. No clicking through views. Just answers.


I built it for myself. Then shared it. Then people started using it in ways I didn't expect. Their feedback pushed me to build something more ambitious: an AI agent that actually understands Airtable.


---


## **The Problem With Database UIs**


Airtable has the best database UI. It makes relational databases accessible to normal humans. 450,000 companies use it. Billions of API calls monthly.


But even the best UI requires context switching. You're writing a proposal and need last quarter's numbers. You're on a call and need customer history. You're planning and need resource availability.


Each time: stop what you're doing, open Airtable, navigate, filter, scan, remember what you were doing, continue.


The MCP solves this. Stay where you are. Just ask.


---


## **What Started Simple**


The first version was bare bones. 7 tools:

- list_tables
- list_records
- get_record
- create_record
- update_record
- delete_record
- search_records

It worked. But users tried complex things:


```plain text
"Create a project tracker with linked tasks, milestones, and assignments"
```


The MCP would fail. Not because it couldn't execute the operations, but because it didn't understand Airtable's rules. Linked records need both tables to exist first. Rollups need specific field types. Lookups can't reference other lookups.


It could execute commands but couldn't reason about them.


---


## **The Evolution**


So I fed it everything.


The entire Airtable API documentation. All 50+ formula functions with edge cases. Field type specifications. The JavaScript SDK. Webhook patterns. Even unwritten rules from years of Airtable use.


56 documentation chunks, indexed for semantic search, loaded intelligently into a 128k context window.


Now it understands Airtable's paradigm:


```plain text
You: "Create a content calendar"

Agent: *thinks* Content calendars need: posts table, authors table,
channels, status workflow. Calendar and kanban views. Single-select
for status (consistent workflow). Formula for days until publish.

*builds complete system with proper relationships*
```


The difference: it knows what you probably want. Status fields should be single-select with colors. Dates need timezone handling. Every table needs meaningful views.


It builds what an Airtable consultant would build.


---


## **Technical Details**


**Architecture:**

1. **MCP Server**: 33 tools covering all Airtable operations
2. **Knowledge Base**: Complete Airtable documentation, searchable
3. **AI Agent**: Reasons about requests, plans operations
4. **Context Manager**: Loads relevant docs into context window

**What it knows:**

- Why rollups are different from lookups (aggregation vs reference)
- When to use linked records vs text fields (data integrity)
- How to structure tables for performance (minimize lookups in formulas)
- Common patterns (CRM pipelines, project trackers, inventory systems)

**Real examples it handles:**


```python
# Inventory system
"Track inventory across multiple warehouses"
→ Creates: products, warehouses, movements tables
→ Adds: stock rollups, reorder formulas, low-stock alerts

# Data migration
"Migrate spreadsheet to proper relational structure"
→ Analyzes schema, creates tables, preserves relationships
→ Handles type conversions, validates data

# Recurring tasks
"Set up weekly recurring tasks"
→ Uses formulas + automations (not naive duplication)
```


---


## **Current State**


**What works well:**

- Query any data without leaving your editor
- Build complete base structures from descriptions
- Migrate data while preserving relationships
- Prevent common mistakes (circular references, invalid formulas)

**What doesn't:**

- Can't override Airtable's limits (5 API calls/second)
- Complex migrations need review
- Some edge cases in formula parsing

---


## **Try It**


**Quick start (MCP only):**


```bash
npx @smithery/cli run @rashidazarang/airtable-mcp \
  --token YOUR_TOKEN --base YOUR_BASE_ID
```


**Full agent with Docker:**


```bash
git clone https://github.com/rashidazarang/airtable-ai-agent
cd airtable-ai-agent
docker compose up -d
```


**Or via Smithery:**

1. Visit smithery.ai
2. Search "@rashidazarang/airtable-mcp"
3. Click Install

Works with Claude Desktop, Cursor, Cline, and Zed.


---


## **Why This Matters**


Airtable democratized databases by making them visual. But there's still friction. You need to understand relationships, field types, views.


Natural language removes that last barrier. Describe what you want. Get what you meant.


It's not replacing Airtable's UI; it's completing it. Sometimes the best interface is no interface.


---


## **Open Source**


Everything is MIT licensed:

- GitHub: [github.com/rashidazarang/airtable-ai-agent](https://github.com/rashidazarang/airtable-ai-agent)
- MCP: [github.com/rashidazarang/airtable-mcp](https://github.com/rashidazarang/airtable-mcp)

PRs welcome. Especially for edge cases I haven't hit yet.


---


A mix of what’s on my mind, what I’m learning, and what I’m going through.


**Co-created with AI. 🤖**


---


## Similar blog posts


Untitled


---


## More about me


My aim is to live a balanced and meaningful life, where all areas of my life are in harmony. By living this way, I can be the best version of myself and make a positive difference in the world. [ ](/f0395458b2ba405eb86b1b95f6288554)[**About me →**](https://rashidazarang.com/personal)


---

