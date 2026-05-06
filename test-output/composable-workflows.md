---
id: composable-workflows
path: /blog/composable-workflows.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 1e652116-a8b1-80a6-a4a5-c6c6aa0ef3f2
meta:
  title: Composable Workflows
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: true
  featured_at:
    - Home Page
  language: English
  post_type: Post
  status: Not started
  comment: Using Cloudflare Workers with tools like Airtable and Zapier.
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/2d0118c7-0872-456c-b5ed-3bf279688ede/Frame_9793-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=3616babbddabdbf3fdc465eba54f6732ca09435545a4950065f4a924d56df814&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Composable Workflows


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


## **How to Build Secure, Composable AI Workflows**


**Using Cloudflare Workers with tools like Airtable and Zapier.**


When organizations first explore using artificial intelligence, they usually begin by plugging AI directly into their tools. For instance, a marketing team might add an API key straight into their Airtable scripts or frontend interfaces to generate social media captions or product descriptions. On the surface, this seems quick and effective. But this approach is like wiring a toaster directly to a power grid—yes, it'll heat bread, but you risk burning down your house.



Embedding API keys directly in scripts creates security risks. Anyone who inspects your webpage or script can find your secret key, using your expensive AI services without permission, running up bills, and compromising sensitive data. This also becomes cumbersome. Imagine managing keys and authentication across ten different tools, each calling the AI service slightly differently. Each small change becomes an operational headache.



![image](notion:1e652116-a8b1-8078-a6f9-f458ee41ed03)


There's a simpler, more secure way: think of using Cloudflare Workers as building a secure "bridge." Rather than directly exposing keys to every tool, you create a single, safe interface—a small serverless function running quietly on Cloudflare's global network. When Airtable, Zapier, or internal dashboards need AI help, they simply call this Worker, which safely handles authentication, sends the request securely to the AI provider, and returns neatly formatted responses. The keys stay secure inside Cloudflare, invisible to everyone else.



The elegance of this pattern lies in its simplicity and clarity. It neatly separates concerns: your Airtable scripts or Zapier automations just ask for what they need (“Hey, give me a nice product description”), while the Cloudflare Worker takes care of the complexity—authentication, error handling, and formatting the request and response. This creates clear boundaries, making your entire workflow simpler and more robust.



Let's imagine an example. Suppose you manage product listings in Airtable. Instead of manually writing or copying and pasting product descriptions, your script asks the Cloudflare Worker, "Give me a compelling summary for these product features." Your request is a simple POST request, no complicated API details exposed. The Worker quietly does its job, sending your request securely to OpenAI or DeepSeek, returning just the text you need. Safe, elegant, and fast.



Another example could be a customer support workflow powered by Zapier. Incoming emails get analyzed by your AI proxy to determine sentiment, categorize urgency, or suggest quick replies. The workflow itself remains simple and clear: Zapier sends content to the Worker and gets back structured data ready to route or respond automatically. No API keys, no complex scripts—just secure, seamless integration.



This approach scales effortlessly. Because your interface (the Cloudflare Worker) is clean and consistent, you can use it everywhere—Airtable, Zapier, custom dashboards, mobile apps. Need to change your AI provider or add new security measures? Update one place—the Worker—and all your tools instantly benefit. This flexibility is invaluable as your business grows.



But beyond practical simplicity, this architecture points toward a bigger idea: modular cognition. By building secure, small, and composable AI services, you're essentially creating cognitive building blocks. Each task—like summarizing, translating, or generating content—becomes a clear module. You compose these modules together into sophisticated workflows without losing simplicity.



![image](notion:1e652116-a8b1-8060-9605-c4638f01f0a6)


Over time, these cognitive modules become something like an operating system for organizational intelligence. Each part is simple, secure, and clearly defined, but when combined, they enable powerful new workflows. The result is a system that grows smarter and more adaptable without becoming harder to manage or less secure.



That's the real promise here—not just secure API integration, but a fundamentally smarter way of working with AI. By adopting this modular cognition mindset, organizations don't just improve security; they unlock creativity, speed, and agility, enabling their teams to solve more interesting problems faster. This architectural approach isn't just about keeping keys safe. It's about creating a scalable foundation for intelligent, creative, and adaptive workflows—something every organization, from startups to large enterprises, can benefit from.


---


### **🛠️ Want to Try This Yourself?**


If you’re curious to try this pattern in your own organization, you don’t need to be a backend expert. You just need a clear blueprint and the right question. You can copy-paste the prompt below into ChatGPT (or any LLM you’re using) to get a friendly, step-by-step walkthrough for building your own secure AI proxy with Cloudflare Workers:



```json
📜 Prompt:

I want to create a secure, lightweight Cloudflare Worker that acts as a proxy for calling a Large Language Model (LLM) API like OpenAI or DeepSeek. I’m using tools like Airtable or Zapier, and I don’t want to expose my API keys in any frontend or script block.

Please guide me step by step through creating this Worker, assuming I’m technically curious but not a backend expert. Include:

1. A simple explanation of how Cloudflare Workers work  
2. How to set up the Worker from scratch  
3. What code I need to paste  
4. Where to store the API key securely  
5. How to test the Worker  
6. How to call it from an Airtable script or Zapier webhook  
7. Optional: How to add temperature, model, or token parameters dynamically  

Make your explanation easy to follow, beginner-friendly, and copy-paste-ready.
```


With just this one prompt, you’ll be well on your way to deploying your first secure, composable AI module. And from there, it only gets more interesting.



Because once you build one cognitive module, you’ll want to build more. Then link them. Then orchestrate them. Before long, you’re not just calling an AI — you’re architecting intelligence.


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

