---
id: the-data-infrastructure-nobody-wants-to-build
path: /blog/the-data-infrastructure-nobody-wants-to-build.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 26852116-a8b1-801f-bf0a-e4e0eb5e656b
meta:
  title: The Data Infrastructure Nobody Wants to Build
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
  comment: 'Date: September 8, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/80303738-22d5-4caf-8f4a-e997f432d410/2ikmage.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=5609e73195afca04f23b826255e88c4fb2cb86ab0a2ed969e8d50f3f9c616154&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# The Data Infrastructure Nobody Wants to Build


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


# The Data Infrastructure Nobody Wants to Build


**Date:** September 8, 2025


## The Problem That Seemed Solved


The promise was so compelling. Natural language finally conquered SQL. You wouldn't need data engineers anymore. Business users could get their own answers. The demos looked perfect.


Then companies tried it in production.


"What's our customer churn rate?" Simple question. The AI writes flawless SQL to count customers. But the answer is wrong. Not because the SQL is wrong, but because the AI doesn't know that your company defines churn differently for enterprise accounts versus self-serve. It doesn't know you exclude seasonal buyers. It doesn't know that finance measures from contract date while product measures from last activity.


This knowledge doesn't exist in your database schema. It lives in your Head of Customer Success's brain, scattered across Google Docs, implied in Excel formulas your CFO guards like state secrets.


The AI can read your tables. It can't read your company's mind.


## What Your Data Actually Contains


Think of your database as containing three layers of information, but only one is actually stored there:

- **Layer 1 - The Facts:** Customer 12345 purchased for $99 on January 3rd. This is what's in your database.
- **Layer 2 - The Meaning:** That was a renewal, not a new purchase. It counts toward net revenue retention. The $99 reflects a loyalty discount. This is what your team knows.
- **Layer 3 - The Implications:** This customer fits the expansion cohort pattern. They need the enterprise sequence, not standard renewal. This is what drives action.

Current AI tools read Layer 1 perfectly. They guess at Layer 2, usually wrong. They're oblivious to Layer 3.


This is the gap nobody wants to acknowledge. Because acknowledging it means accepting that the real work can't be skipped.


## The Physics Problem Nobody Mentions


Here's something vendors won't tell you: every question has a computational cost, and you can either pay it once or pay it forever.


Take a simple metric: weekly active users. The AI can count unique users from the last seven days. Easy. But that means scanning millions of rows every time someone asks. Every. Single. Time.


Your CEO checks the dashboard five times a day? That's five full table scans. Your board meeting has twenty people looking at metrics? Twenty scans. Same computation, repeated endlessly.


The alternative is pre-computing these metrics once and storing the results. But that requires infrastructure: orchestration, scheduling, storage, invalidation logic. Real engineering work.


Guess which approach every "plug-and-play" solution uses? The wasteful one. Because the efficient one requires admitting that infrastructure matters.


## Why Business Questions Aren't Queries


"Why did revenue drop?" isn't asking for a number. It's launching an investigation.


Real analysis follows a workflow:

1. Define the drop (versus what baseline?)
2. Segment the problem (which products? regions? segments?)
3. Find anomalies (what changed?)
4. Test hypotheses (seasonality? competition? our changes?)
5. Validate findings (statistical significance? confounding factors?)

This is detective work, not database queries. It requires maintaining context, building on previous findings, remembering what you've already eliminated.


Current AI analysts treat every question as isolated. They can't build investigative threads. They're like a detective with amnesia, starting fresh with every clue.


## The Infrastructure Everyone Actually Needs


Here's what works in production:


## The Uncomfortable Truth


The work is irreducible. You can't automate away the need to understand your business. You can't skip encoding that understanding into systems. You can't pretend that complex questions have simple answers.


This isn't what people want to hear. They want the magic solution, the plug-and-play miracle. They want to skip the months of semantic modeling, the careful orchestration design, the tedious validation rules.


But here's what I've learned from watching hundreds of data projects: the companies that accept this truth and do the work get massive advantages. Their data actually works. Their decisions are actually informed. Their AI assistants actually assist.


The companies that keep looking for shortcuts keep buying new tools, keep running POCs, keep wondering why nothing quite works.


## The Real Innovation Opportunity


The breakthrough isn't better AI. GPT-5 won't solve this. Claude won't figure out your business logic by reading your database.


The breakthrough is making the irreducible work more tractable. It's building semantic layers that can be shared across similar companies. It's learning patterns from hundreds of implementations. It's encoding business logic in ways that are both human-maintainable and machine-executable.


Most importantly, it's accepting that infrastructure is the product. The semantic layer isn't overhead, it's the core value. The pre-computation isn't optimization, it's what makes the system usable. The validation isn't paranoia, it's what makes the system trustworthy.


## What This Means


If you're evaluating AI data tools, ask these questions:

1. Where does business logic live? If the answer is "the AI figures it out," run.
2. How are common metrics pre-computed? If they aren't, prepare for terrible performance.
3. How do multi-step investigations work? If they don't, you can't answer real questions.
4. How is accuracy validated? If it isn't, you'll get convincing nonsense.

If you're building data infrastructure, accept these truths:

1. The semantic layer is mandatory, not optional
2. Pre-computation is physics, not preference
3. Workflows are the unit of analysis, not queries
4. Validation is essential, not nice-to-have

The market will eventually learn these lessons. The question is whether you learn them now, while they're still competitive advantages, or later, after you've wasted years on solutions that can't work.


The semantic layer is the product. The AI is just the interface.


That's what nobody wants to build. It's also what everybody needs.

