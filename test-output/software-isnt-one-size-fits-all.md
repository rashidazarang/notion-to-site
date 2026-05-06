---
id: software-isnt-one-size-fits-all
path: /blog/software-isnt-one-size-fits-all.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 24f52116-a8b1-8002-8671-dc409069e660
meta:
  title: Software Isn’t One-Size-Fits-All
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
  comment: 'Date: August 14, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/4261da52-1eae-406a-8379-ab0e612aeb63/image34.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=94d1545bcc7dbf57a5955ca8a8690252a7e6903c0830b16134c69fd02e2deaea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Software Isn’t One-Size-Fits-All


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


## **Software Isn’t One-Size-Fits-All**


**Date:** August 14, 2025


When people talk about “integrating software,” they often imagine something tidy: two systems shaking hands, exchanging data, and everyone going home early.


In reality, integration is never a single thing. It’s a spectrum. On one end, you have software that’s almost eager to be integrated. On the other, you have software that resists like it’s trying to hide something.


![image](notion:25052116-a8b1-8035-a35a-c285ac488327)


At the easy end, the software gives you a well-documented API. The IDs it uses are stable. The responses are predictable. If you ask the same question twice, you get the same answer. Working with this kind of software feels like building with Lego bricks; you spend your time designing, not fighting the pieces.


At the hard end, the software has no API. Or if it does, it’s incomplete, undocumented, or unreliable. The identifiers change without warning. Two records that look the same today might have different IDs tomorrow. You find yourself building strange contraptions just to keep track of what’s what. Instead of Lego bricks, you’re working with wet clay; every time you touch it, it changes shape.


![image](notion:25052116-a8b1-80eb-b612-c01f81afd5c4)


The trouble is, most people don’t realize how wide this spectrum is until they’ve been burned by the hard end. They assume all integrations take the same amount of effort. Or worse, they assume all effort is proportional to the number of features. But complexity isn’t linear. A small piece of hostile software can eat more time than an entire cooperative system.


One example: UUIDs. Universally Unique Identifiers are supposed to be stable. That’s the “U” in UUID. But some systems generate them in ways that aren’t truly consistent. Or they change them when records are updated. If you’re trying to keep a connection between two systems, that’s like having the road signs change every time you drive to work. You can still get there, but now you need a map that updates itself on the fly.


If you’re choosing software for your company and you know you’ll have to integrate it, this is the part you should pay attention to. Not just “Does it have an API?” but “Is that API stable, documented, and designed for other systems to use?” Not just “Does it have IDs?” but “Will those IDs still mean the same thing next year?”


The irony is, the easier a system is to integrate, the less you think about it once it’s running. Good integration disappears. Bad integration demands constant attention.


And if you’ve ever had to maintain a bad one, you’ll start making software choices differently. You’ll start looking not just at features, but at the shape of the system beneath them. You’ll pick tools that want to work with you, not against you.


Integration isn’t a single skill. It’s a relationship. And like any relationship, it’s a lot better when the other side meets you halfway.


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

