---
id: getting-software-to-talk-to-each-other
path: /blog/getting-software-to-talk-to-each-other.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 24152116-a8b1-80dd-8965-c73835634b31
meta:
  title: Getting Software to Talk to Each Other
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
  comment: 'Date: July 30, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/3f89ea94-c231-47c0-8a1b-36ac91e4db8c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=5d13e434e8e0724b1f2d533d39b45edaeec312bba81583ae2b080a502aea33ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Getting Software to Talk to Each Other


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


# How We're Making Business Software Talk to Each Other 10x Faster


**Date:** July 30, 2025


For decades, integrating data between software systems has been a tedious, costly, and frustrating process. Businesses had no choice but to hire specialized engineers, spend weeks learning complex APIs, write thousands of lines of custom ETL (Extract, Transform, Load) code, and constantly maintain these integrations to avoid breaking whenever a system updated.

But now, there’s a revolutionary approach that’s changing all this: the Model Context Protocol (MCP).


![image](notion:24152116-a8b1-80ca-a628-de4df049358a)


---


## **The Painful Reality**


Imagine you’re a growing business. Your customer data lives in Salesforce, invoices in QuickBooks, emails in Gmail, and projects in Asana. When a customer emails asking about their order, you have to:

- Check CRM for customer details
- Find order details in your inventory system
- Verify payment in your accounting system
- Review support tickets

That’s multiple systems, multiple logins, and far too much time. Typically, businesses would hire a developer to connect these systems through a painful, expensive, and slow process:

- **Weeks 1-2**: Engineer learns each system’s API
- **Weeks 3-4**: Writes custom extraction and transformation code
- **Weeks 5-6**: Tests integrations, finds issues, rewrites code
- **Week 7 onwards**: Continuous maintenance as APIs evolve


This process averages around 40 hours per integration and is incredibly costly.


---


## **A Better Way**


Here’s the game-changing insight: Systems don’t need to talk to each other directly, they just need to be understandable to AI.



MCP is a protocol that transforms complex software interfaces into semantic, AI-friendly formats. Instead of writing detailed instructions (ETL code), you simply make the system’s capabilities clear to an AI:

- What data exists?
- How is it structured?
- What operations are allowed?
- What rules apply?


Once an MCP interface is in place, AI instantly understands how to interact with your software. No custom code required.


---


## **MCP in Action**


Let’s look at a real-world example:


**Client**: An insurance brokerage using Salesforce (CRM), QuickBooks (accounting), and AMS360 (insurance management)




### **Traditional Approach**

- Spend weeks learning APIs
- Write thousands of lines of integration code
- Constant updates and maintenance
- Total time: 6-8 weeks

### **MCP Approach**

- Deploy MCP adapters (a few hours)
- Document the client’s use of each system (a few hours)
- Let AI understand and create integrations (a few hours)
- Validate and deploy quickly
- Total time: 3-4 days


The MCP approach isn’t just faster and cheaper, it’s also far more robust. If AMS360 updates its API, the MCP adapter updates once for everyone. No custom integrations to break.


---


## **Why MCP Matters**


The MCP approach gets better as you scale. Each MCP adapter created helps future integrations. Instead of constantly reinventing the wheel:

- One MCP server works for all clients
- New systems require only one-time MCP setup
- Engineers focus on business context, not API specifics


Over time, integration becomes simpler, cheaper, and faster.


---


## **Beyond Integration**


The real benefit isn’t just easy integration, it’s the new capabilities you gain once your data is unified:

- **Natural language queries**: Ask questions like, “Which customers haven’t ordered in 90 days?”
- **Cross-system automation**: Automate tasks across multiple systems seamlessly.
- **Predictive insights**: Anticipate issues like cash-flow problems before they arise.


Your data warehouse transforms from a static database into an intelligent, actionable layer for your entire business.


---


## **The Future**


If you’re still using traditional ETL methods, it’s time to stop. Technology has evolved. With MCP, you no longer need deep technical knowledge of each system. Instead, you focus on understanding your business processes and letting AI do the rest.



Businesses save significant time and money. Developers shift from writing complicated code to facilitating intelligent integrations. And the industry is rapidly moving toward a simpler, smarter way of connecting software.



This isn’t just the future of data integration, it’s the present, accessible to everyone from small businesses to large enterprises.



Welcome to the new world of semantic, AI-powered integration. It’s simpler, smarter, and here right now.


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

