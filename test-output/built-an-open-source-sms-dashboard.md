---
id: built-an-open-source-sms-dashboard
path: /blog/built-an-open-source-sms-dashboard.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 27352116-a8b1-80a2-8553-d251a4a2d621
meta:
  title: Built an Open-Source SMS Dashboard
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
  comment: 'Date: September 18, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/8f343355-5b47-4949-8495-6d2f38efe422/4B4F4891-6B04-4CCE-8D40-15E2C702E8EF.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=2ed17de722f7718430d1555869ac4e382dc27cd01d857efff8485deaaa21a888&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Built an Open-Source SMS Dashboard


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


## Built an Open-Source SMS Dashboard That Twilio Should Have Made


**Date:** September 18, 2025


You know that sinking feeling when a customer says "I never got your text" and you have no idea why? That's exactly why I built Twilio SMS Tracker - then open-sourced it so everyone can have proper visibility into their SMS infrastructure. Here's what I've learned about SMS infrastructure.


[Video](https://vimeo.com/1119997435?share=copy)


---


## The Dashboard That Shows Everything


Every business sending SMS faces the same black hole: messages go out, but then what? You're left guessing if they arrived, why they failed, or which locations have problems. This changes that completely.


![image](notion:27352116-a8b1-80d5-b4b1-fb0335a3ba82)


### 📈 Real-time KPIs That Matter

- Total messages sent
- Actual delivery rate percentage
- Messages stuck in queue
- Failed messages with one-click retry

> 💡 When a message fails, you see the exact Twilio error code. Not "delivery failed" but "Carrier violation 30007 - spam detected" or "Invalid phone number format."


### 🔄 One-Click Retry for Failed Messages


Failed messages aren't dead ends anymore:


```javascript
// Before: Customer calls, you check Twilio logs, manually resend
// Now: Click retry button, done
```


No support tickets. No manual re-entry. Just click and retry.


---


## **Message Configuration**


Configure SMS templates with dynamic variables and automatic review platform rotation.



![image](notion:27352116-a8b1-8078-8809-e96e6aef8107)


### 📊 Automatic A/B Testing


The system automatically rotates between review platforms:

- 50% of customers → Google Reviews
- 50% of customers → Trustpilot

After 10,000 messages, you'll know which platform gets more clicks. No spreadsheets required.


---


## Analytics That Drive Decisions


Track performance by dealership, branch, or any custom location parameter.


![image](notion:27352116-a8b1-8070-8398-e21229c041d9)


Finally answer questions like:

- Which location has the best review response rate?
- What time gets the highest engagement?
- Which branches have delivery problems?

### 📤 Export Everything to CSV


Your data, your format, whenever you need it:


```plain text
timestamp,phone,status,error_code,dealership,message
2024-01-15 14:23:01,+14155551234,delivered,null,Bay Motors,Review request
2024-01-15 14:23:45,+14155555678,failed,30007,City Auto,Carrier block
```


---


## The Tech Stack That Just Works


I deliberately chose boring, reliable technology:


```yaml
Frontend: HTML + JavaScript + Alpine.js (no build step!)
Backend: Node.js + Express + TypeScript
Queue: Bull MQ + Redis (handles failures gracefully)
Database: PostgreSQL (free tier works fine)
SMS: Twilio API
Hosting: Vercel (serverless, scales automatically)
```


---


## Setting It Up in 5 Minutes


### Step 1: Click Deploy


![image](notion:27352116-a8b1-8034-81c5-c216f8e1c5a4)


### Step 2: Add Your Credentials


```plain text
DATABASE_URL=your_postgres_url      # Get free from Neon.tech
TWILIO_ACCOUNT_SID=ACxxxxx         # Your existing Twilio account
TWILIO_AUTH_TOKEN=xxxxxx           # Your auth token
TWILIO_PHONE_NUMBER=+1234567890    # Your Twilio number
```


### Step 3: Send a Test Message


```bash
curl -X POST https://your-app.vercel.app/webhook/transaction-complete \
  -H "x-api-key: your-api-key" \
  -d '{"customer_phone": "+14155551234", "customer_name": "Test User"}'
```


That's it. You now have production SMS infrastructure.


---


## Real Problems This Solves


---


## Why Open Source?


Because infrastructure this critical shouldn't be a mystery. With open source you get:

- **No vendor lock-in** - Fork it, modify it, own it
- **Complete transparency** - See exactly how messages are processed
- **Community improvements** - Users become contributors
- **Free forever** - No per-message fees, no seat licenses

---


## Quick Start Commands


```bash
# Clone and run locally
git clone https://github.com/rashidazarang/twilio-sms-tracker
cd twilio-sms-tracker
npm install
npm run dev

# Or deploy directly to Vercel
vercel deploy
```


---


## More about me


My aim is to live a balanced and meaningful life, where all areas of my life are in harmony. By living this way, I can be the best version of myself and make a positive difference in the world.

Professionally, I focus on the design and implementation of cognitive infrastructure: systems that make complex enterprise data usable through AI-powered tools and human-like interaction.



[**About me →**](https://rashidazarang.com/personal)


---


## Similar blog posts


Untitled


---

