---
id: architecting-weather-data-storage
path: /blog/architecting-weather-data-storage.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 25c52116-a8b1-809f-a86b-ce3f967b7e2f
meta:
  title: Architecting Weather Data Storage
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
  comment: 'Date: August 27, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/55b7f866-c1e6-4f3d-bcc7-38746d6f842d/jjimage.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=84eafe232c108727b6df9fe8b0094cc8ec57d9463798054ce0071fcdf656efdd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Architecting Weather Data Storage


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


# **Architecting Weather Data Storage**


**Date:** August 27, 2025


## The Fundamental Problem


Weather forecast systems face a unique data challenge: serving millions of point queries from datasets containing billions of values. A global weather model with 4 million grid cells, 168 hourly timestamps, and 35 variables contains nearly 24 billion data points. Users typically request a tiny fraction: the forecast for one location. This massive selectivity ratio (retrieving ~6,000 values from 24 billion) defines our entire storage strategy.



The problem compounds with continuous updates. Weather models run every 3-6 hours, each execution partially overwrites previous predictions with newer, more accurate data. Any storage solution must handle constant writes while maintaining read performance.


---


## Access Patterns Drive Architecture


Start with how data is accessed, not how it's naturally structured. Weather data originates as grid snapshots at discrete timestamps, but APIs serve time-series for specific locations. This mismatch between production and consumption patterns is the root cause of most performance problems.


Consider two query types:

1. "Show global temperature at 3 PM tomorrow" (spatial query)
2. "Show this week's hourly forecast for New York" (time-series query)

Most applications need the second type. Optimizing for spatial queries when 99% of requests are time-series queries is architectural malpractice. Storage must align with dominant access patterns.


---


## Why Traditional Approaches Fail


### Naive File Storage


Storing each timestamp as a separate gridded file seems logical but requires opening 168 files to build a week's forecast. File operations have fixed overhead regardless of data size. Reading one value from 168 files takes longer than reading 168 values from one file. Multiplication of overhead kills performance.


### Relational Databases


Tables with rows for each observation appear to solve the problem but introduce different inefficiencies. Every row duplicates metadata (timestamp, coordinates), indices consume massive memory, and bulk updates during model refreshes lock tables for hours. The fundamental issue: relational databases optimize for flexible queries, but weather APIs have completely predictable access patterns. This flexibility has a cost we don't need to pay.


---


## The Solution: Reorganize Around Usage


Instead of storing data as produced (time-then-location), store it as consumed (location-then-time). Transform the three-dimensional dataset from [timestamp][latitude][longitude] to [latitude][longitude][timestamp]. Now each geographic point's complete time-series is contiguous on disk.


This reorganization enables single-read operations for entire forecasts. Disk controllers and operating systems are optimized for sequential reads. Modern SSDs can read sequential data at 3+ GB/second but random reads are 100x slower. By making time-series queries sequential, we align with hardware capabilities.


---


## Critical Implementation Details


### Update Strategy


New model runs must merge with existing data without disrupting reads. In-place updates work best: maintain fixed-size files where new runs overwrite specific byte ranges. This eliminates file fragmentation and simplifies backup strategies. Each file holds perhaps 10 days of data, with model runs continuously updating the relevant portions.


### Memory Mapping


Treat files as arrays in memory using mmap(). The operating system handles paging, keeping frequently accessed data in RAM. Popular locations stay cached automatically. This provides database-like convenience with file-based performance.


### Data Type Selection


Not all variables need 32-bit precision. Temperature can use 16-bit floats, saving 50% storage with negligible accuracy loss. Binary flags (precipitation yes/no) need just one bit. Careful data type selection can reduce storage by 60% or more.


### Compression Trade-offs


Compression saves storage but adds CPU overhead. For archived data, aggressive compression makes sense. For active forecasts serving thousands of requests per second, decompression latency may exceed storage savings. Measure actual workload patterns before committing to compression.


---


## Scaling Considerations


### Horizontal Partitioning


Divide the globe into regions, each stored on different servers. North American queries hit North American servers. This provides natural load balancing and enables regional deployment close to users.


### Time-Based Tiering


Recent forecasts need millisecond access. Last month's data can tolerate 100ms latency. Last year's might accept seconds. Use SSDs for current data, HDDs for recent history, and object storage for archives. Let access patterns determine storage tiers.


### Distributed Challenges


Distributed filesystems introduce network latency. A local SSD reads in microseconds; network storage adds milliseconds. Cache aggressively and consider read replicas over shared storage for performance-critical paths.


---


## Practical Validation


Well-architected systems achieve remarkable metrics:

- Single forecast retrieval: <2ms
- Cached queries: <0.5ms
- Storage efficiency: 10-20% of naive approaches
- Update latency: Minutes, not hours
- Infrastructure cost: 80-90% reduction


These aren't theoretical limits but actual production measurements from systems serving millions of daily requests.


---


## Beyond Weather: Universal Principles


The core insight transcends meteorology. Any system with these characteristics benefits from similar architecture:

- Large multi-dimensional datasets
- Predictable access patterns
- Frequent partial updates
- Time-series queries dominating spatial queries

IoT sensor networks, financial tick data, satellite imagery, and monitoring systems all exhibit these patterns. The solution remains consistent: organize storage around consumption patterns, not production patterns.


---


## Key Lessons

1. **Profile before architecting**: Measure actual query patterns. Don't assume.
2. **Embrace specialization**: General-purpose databases solve general problems generally. Specific problems deserve specific solutions.
3. **Hardware awareness matters**: Sequential reads, page sizes, and cache hierarchies aren't implementation details. They're fundamental constraints that shape architecture.
4. **Denormalization is a tool**: Storage is cheap. Computation is expensive. Trade space for time when access patterns are predictable.
5. **Update strategies define systems**: How data changes is as important as how it's queried. Design for your update pattern, not against it.

---


## Conclusion


Efficient weather data storage isn't about clever algorithms or exotic databases. It's about accepting that data organization must reflect usage patterns. When we store time-series data as time-series, not as grids or relations, performance improvements aren't incremental but transformational. The same principle applies broadly: align storage with access, and complex problems become simple. Fight against this alignment, and simple problems become complex. The choice, and the consequence, is architectural.


---


Read more: [Building A Supply Chain Risk Management Platform](https://www.notion.so/25852116a8b180c68733ca90d6846e5e) 


---


A mix of what’s on my mind, what I’m learning, and what I’m going through.


**Co-created with AI. 🤖**


---


## More about me


My aim is to live a balanced and meaningful life, where all areas of my life are in harmony. By living this way, I can be the best version of myself and make a positive difference in the world.

Professionally, I focus on the design and implementation of cognitive infrastructure: systems that make complex enterprise data usable through AI-powered tools and human-like interaction.



[**About me →**](https://rashidazarang.com/personal)


---


## Similar blog posts


Untitled


---

