---
id: building-a-supply-chain-risk-management-platform
path: /blog/building-a-supply-chain-risk-management-platform.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 25852116-a8b1-80c6-8733-ca90d6846e5e
meta:
  title: Building A Supply Chain Risk Management Platform
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
  comment: 'Date: August 23, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/de7daa0f-c9f8-4ba2-a0ce-c94e543628fc/imdfdage.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=63b5f82c608c6ad7da140b858334bf6b8b3a33a8ef013047a5ab2259af76a748&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Building A Supply Chain Risk Management Platform


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


# Building A Supply Chain Risk Management Platform


**Date:** August 23, 2025


I recently built a supply chain risk management platform. It started as a simple idea: what if companies could get real-time alerts about hurricanes affecting their suppliers? But it evolved into something bigger.


[Video](https://vimeo.com/1112502723?share=copy)


## What It Does


It monitors multiple risk factors that can disrupt supply chains:

- **Hurricane tracking** - Integrates with NOAA's API to track active hurricanes and calculate risk scores based on how close they are to your suppliers
- **Port congestion** - Monitors 80+ global ports for delays and congestion that could impact shipments
- **Currency fluctuations** - Tracks exchange rates for supplier currencies to identify financial risks
- **Weather monitoring** - Keeps tabs on weather conditions at supplier locations and shipping routes

The platform automatically filters this data based on each client's actual supply chain. So if you only have suppliers in Asia and ship through LA/Long Beach, you won't see alerts about European ports or Atlantic hurricanes.


---


## The Technical Build


I used Next.js 14 with TypeScript for the frontend and API routes. The UI is built with Tailwind CSS and shadcn/ui components, which gave me a clean, professional look without spending weeks on design.


For the backend, I went with Supabase (PostgreSQL) for the database. It handles multi-tenant data isolation well with Row Level Security, which was important since different clients need to see different data.


The interesting part was integrating multiple data sources:

- NOAA Weather API for real hurricane data
- Mock data for port congestion (real APIs were too expensive for a side project)
- Currency exchange rates from various free tier APIs

---


## Key Features


**Intelligent Filtering**: The system has three data scope modes - broad (see everything), narrow (only your direct suppliers), and intelligent (AI-filtered relevance). This prevents information overload.


**Risk Scoring**: Each threat gets scored on a 1-10 scale based on proximity, intensity, and potential impact. The scoring algorithm considers distance to suppliers, hurricane category, timing, and the client's vulnerability factors.


**Export System**: Users can generate PDF reports, Excel workbooks, or CSV exports of their risk data. Useful for executive presentations or further analysis.


**Multi-Client Support**: Built with a proper multi-tenant architecture so multiple companies could use the same instance while keeping their data separate.


---


## Challenges


The biggest challenge was dealing with API rate limits and costs. NOAA's free API has limits, and real-time port data APIs are expensive. I ended up using a caching strategy and fallback mock data to keep it functional.


Another interesting problem was making the data relevant. Nobody wants to see alerts about all 80 ports when they only use 5. So I built an intelligent filtering system that learns which ports and routes are relevant to each client's supply chain.


---


## Current Status


The platform is currently offline, running multiple real-time APIs got expensive for a side project. But all the code is open source and available if anyone wants to spin up their own instance or learn from it.


The codebase includes:

- Complete Next.js application with TypeScript
- Database schemas and migrations
- API integration examples
- Risk scoring algorithms
- Export generation system
- Multi-tenant architecture patterns

It was a fun project that taught me a lot about supply chain complexities, real-time data processing, and building SaaS platforms. Even though it's not running anymore, I'm glad I built it.


Check out the code on GitHub: [https://github.com/rashidazarang/predicting-supply](https://github.com/rashidazarang/predicting-supply)

