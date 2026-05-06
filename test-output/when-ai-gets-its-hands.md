---
id: when-ai-gets-its-hands
path: /blog/when-ai-gets-its-hands.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 24652116-a8b1-809a-988d-d04485d35d47
meta:
  title: When AI Gets Its Hands
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
  comment: 'Date: August 4, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/0f4f3085-d73a-4deb-9272-d0d8f3722d8a/imagfde.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=b3ad1fdded9a457ee8932a6ee93835f750d38f79c5efbc8c4c0e665ec45b01b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# When AI Gets Its Hands


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


# When AI Gets Its Hands


**Date:** August 4, 2025


Most of the AI revolution so far has been about understanding. GPT understands your questions. Claude understands your code. But understanding without action is like having a brilliant advisor who can only talk.


What if your AI could actually _do_ things?


Not through some complex integration or API dance. Just by talking to it, the same way you always have. "Read that file." "Send this email." "Open that website and grab the data."


This is what MCP servers enable. And it's more significant than it might first appear.


![image](notion:24652116-a8b1-806f-8785-e0345f6aa243)


---


## The Problem With Pure Intelligence


Here's something I've noticed: the smarter AI gets, the more frustrating it becomes that it can't actually touch anything. It's like being helped by someone wearing oven mitts. They can see what needs doing, explain exactly how to do it, but can't pick up the tools themselves.


We've been working around this limitation with copy-paste. AI writes code, you run it. AI drafts an email, you send it. AI suggests file organization, you move things around. It works, but it's clunky. Like programming through a translator.


The interesting thing about MCP (Model Context Protocol) is that it solves this in the obvious way that, somehow, nobody was doing. Give the AI actual tools. Not cloud APIs or enterprise integrations. Just simple, direct access to do things on your machine.


---


## How It Actually Works


An MCP server is just a small program that exposes functions. That's it. No magic.


When you enable a filesystem server, Claude gets functions like `read_file` and `write_file`. When you enable email access, it gets `send_email` and `read_inbox`. Each server defines what it can do using a simple schema.


The clever part is how boring it is. No AI-specific protocols. No special frameworks. Just JSON-RPC over a local connection. The same pattern we've used for decades, applied to a new problem.


This matters because boring technology is reliable technology. And when you're letting AI touch your actual files, you want boring.


---


## The Shift From Advisor to Assistant


What changes when AI can act? Everything, it turns out.


Consider email. Right now, AI can draft a perfect response. But you still need to copy it, paste it, format it, add recipients, and hit send. With MCP, you just say "reply to John's email about the meeting" and it happens. The friction goes from minutes to seconds.


Or file management. Instead of "here's a Python script to organize your downloads folder," it's just "organize my downloads folder." Done.


The pattern repeats everywhere. Browser automation. System commands. Calendar management. Each tool that gets added removes another layer of manual translation between AI's understanding and real action.






---


## Why Local Matters


There's something important about these servers running on your machine. It's not just about privacy, though that matters. It's about immediacy and trust.


Cloud APIs introduce latency, authentication, rate limits, and payment walls. Local servers have none of that. They're fast, free, and fully under your control. You decide what directories Claude can access. You approve each new capability.


This isn't the enterprise integration approach of "connect everything to everything." It's more like Unix philosophy: small tools that do one thing well, composed as needed.


---


## The Compound Effect


Here's what I think is really interesting: MCP servers compose.


Need to analyze sales data? Claude can read the email with the report, extract the attachment, open it in a browser, scrape the dashboard for comparison, and write up the analysis. One request, multiple tools, seamless execution.


This is where the oven mitts come off. AI stops being just a smart talker and becomes something more like a digital employee. Not in the dystopian "AI takes your job" sense, but in the "finally, someone else can handle the tedious stuff" sense.


---


## What This Actually Means


I think we're seeing the beginning of a new interface paradigm. Not GUI, not CLI, but something else. Natural Language Interface, maybe, though that sounds too formal.


The point is: you stop thinking in terms of applications and start thinking in terms of tasks. You don't "open email, click compose, type address." You just say what you want done.


This is the promise computing has been making since the beginning. The computer as bicycle for the mind. Except now the bicycle can steer itself while you think about where to go.


---


## The Near Future


What happens when this pattern spreads? When every application exposes MCP endpoints? When your AI assistant can not just read and write files, but actually use your tools the way you do?


I suspect we'll look back at the current era—where we copy-paste between ChatGPT and everything else—the way we look at punch cards. Not wrong, just primitive.


The infrastructure is here. The protocols are simple. The only question is how fast the ecosystem builds around it.


My guess: faster than people expect. Because once developers realize they can give their users AI superpowers with a few hundred lines of code, they will.


The AI revolution started with intelligence. The next phase is agency. And it's starting on your desktop.


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

