---
id: the-infrastructure-nobody-sees-until-it-breaks
path: /blog/the-infrastructure-nobody-sees-until-it-breaks.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 2d852116-a8b1-8023-b2c8-db80d5357e4c
meta:
  title: The Infrastructure Nobody Sees Until It Breaks
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
  comment: >-
    Parking lots are perfect infrastructure. Not because they work well, but
    because they're invisible when they work and catastrophic when they don't.
    Like breathing or internet routing, you only notice…
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/74840372-f36b-49e7-be3d-00b5d7d19949/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KOVYJQ3%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNC3t7rwF8%2BAUENfgBc6SDYvO4Gow65Eq9cDNPi%2BE83AIhAIBgyqGu8VPWiRt7GdY7BpT0bYaEMofV4VQegLL8QI8PKogECJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyaCYrW3DWuiMdWwEgq3AOHRyDtjr5MAhoLBNj3I4C36JFCakxr5oEdVeDntEoLj%2B0LTu7gfjvARYuBVHJyWD1SC4JRkV44tOn3vCJf3I9eziE1eKUDaQVJjSd1mGO5osLKmuFG%2Bmd2cCT06xBzj1%2FEImbiscdwo0pJYoL%2B8jB9TMmMl%2FdKuzYeuvdMI1pXHDtYq81wty7IYhmqW4QVCK0hqa20VkqTxnvE0goXxRG6z3dz9y8ZmzYsTbgb5gm0XzqTMW5oiqek3RMPL1Dv6c1dw1VE34fFCgnImQleYbNPS2tYfZXx%2F4uKf%2Bzu873C47wesDNmnZDqLNRt3dvuzNXu7OlpRhS2jDD5Oc6WmTEYo1%2FPwH0kAVTGEcuT8brvHB08RG7xW0JILy6PQBjFj16g3CRx2iJufV39TdffVvG4FVFnN5oEBtPFipwyFdNwyWB2ToULoS5cqgwUVG999L1T6M1%2BUc6O%2B8wGnhsJF35dCO3O0na4oB1arATe7cd7xYzg%2FFbPff1VVE3eQjcC3u4lE0HRpI%2BBTnZxZ5AiYlVD7HJZWD4DxUIbXsvBcUD%2FUYWAImjV1fz2rYr4SSI4jEDFzpl9H%2FO7I%2FuHZdty7KAIlzAzGxB26%2BGkWkJWjqlDz%2FSZBkSuZOQVCs2M9jCtmuvPBjqkAZBeLGpgNoGRbc8KxXkps8bh2aO6RUk86TYWE6YmoVz%2FRDo8Z1c%2FXRcKCmayvSiKMFlgKSd%2FSstGGOXRXJJY0WedVHlpbBJEoSKk2olx5zYNQbbBvTBS1ub6BHr%2BxjxbFZ8E6lLKFDUKQ7IiRF%2Fx8F7a%2BNj%2BSfODpE%2B2ehQAdj7a%2BJ15jZG1mVKNd6LFYtr2k8Cm5%2FaYwk3l5gyRGns3XE1IpaYM&X-Amz-Signature=85deec703d3f5a093b9a6cba64fe5d84a1ee530d40d59ba43a20cc477fdba326&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# The Infrastructure Nobody Sees Until It Breaks


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


## The Infrastructure Nobody Sees Until It Breaks


Parking lots are perfect infrastructure. Not because they work well, but because they're invisible when they work and catastrophic when they don't. Like breathing or internet routing, you only notice them during failure.


This invisibility creates a problem: we design critical infrastructure with surprisingly little rigor. Parking facilities that handle thousands of vehicles daily are planned with rules of thumb and building codes written decades ago. The tools to do better exist, but they're either too expensive or too simple. So we build infrastructure that works until it doesn't, then wonder why it failed.


I learned this the hard way at Pabellón M in Monterrey.


![image](notion:2d852116-a8b1-8054-9fd9-dc9f19191783)


### When Flow Becomes Visible


Pabellón M is a major commercial and event venue. During normal operations, nobody thought about parking flow. Cars arrived, parked, left. Invisible infrastructure doing its job.


Then came peak events. Exit queues spilled onto public roads. Frustrated drivers circled for spots. Intersections blocked. The invisible became painfully visible. Our engineering team was called in to fix what nobody had thought needed fixing.


Our task seemed simple: analyze flow patterns, recommend improvements. The reality was complex. We needed to understand arrival distributions, measure service times, model queuing dynamics, test routing strategies. Every "what if we add another exit lane?" required substantial calculation.


What struck me wasn't the complexity. It was the tool gap. Professional traffic simulators cost tens of thousands, take weeks to configure, and assume you're modeling an entire city. Simple calculators ignore the randomness that causes real problems. Spreadsheets can't handle queuing dynamics.


We were solving 21st-century problems with 20th-century tools. And we weren't alone. Every parking facility faces these questions. Most answer them with guesswork.


### The Missing Middle


This gap exists across infrastructure design. On one side: enterprise software that requires consultants to operate. On the other: back-of-envelope calculations that miss critical dynamics. Nothing in between.


The gap persists because of a category error. We think of parking as static capacity. Five hundred spots means five hundred cars. Simple.


But parking is dynamic flow. Cars arrive randomly, cluster unpredictably, stay variable durations, leave in waves. The same lot that's empty at 2 PM is gridlocked at 6 PM. Not because capacity changed, but because flow dynamics shifted.


Static thinking says: "We have 500 spots and average 400 cars, we're fine."


Dynamic thinking asks: "What happens when 100 cars try to leave in 10 minutes through 2 exit lanes?"


The difference between these questions is the difference between a parking lot that works and one that fails during your biggest event.


### Building the Bridge


I built the Parking Flow Simulator to bridge this gap. Not to replace professional tools or validate napkin math, but to make rigorous analysis accessible.


The technical approach was straightforward. Discrete-event simulation for accuracy. Statistical distributions matching real-world patterns. Monte Carlo iterations for confidence intervals. Standard stuff for simulation experts, but packaged for parking designers.


The design philosophy was more important than the technology:

- **Make randomness visible**. Real arrivals aren't uniform. They cluster, surge, and ebb. The simulator shows this.
- **Answer practical questions**. Not "what's the theoretical capacity?" but "will cars get rejected during peak hour?"
- **Enable comparison**. Every design is a hypothesis. Test multiple scenarios side by side.
- **Ensure reproducibility**. Same inputs, same outputs. Auditable, verifiable, trustworthy.

The result: rigorous analysis that takes minutes, not weeks.


### What Changes When Analysis Is Accessible


Consider a real scenario: a 240-spot structure with peak-hour congestion. Three options:


Option A: Add a third exit lane. Cost: $200,000.
Option B: Upgrade payment system to reduce transaction time. Cost: $50,000.
Option C: Implement dynamic pricing to spread demand. Cost: $10,000.


Without simulation, you're guessing. With enterprise software, you're spending weeks and thousands on analysis. With accessible tools, you test all three in an afternoon.


The simulator shows Option B achieves 80% of Option A's improvement at 25% of the cost. Option C works better for some arrival patterns, worse for others. Now you're making informed decisions, not educated guesses.


This isn't just about parking. It's about a category of problems where the cost of being wrong is high, but the cost of analysis has been higher. When you lower the cost of analysis, you change what gets analyzed.


### The Open Source Imperative


I released this as open source for a simple reason: infrastructure analysis shouldn't be gatekept by software licenses.


The problems we solved at Pabellón M exist at every shopping center, hospital, stadium, and office complex. The difference between good and bad parking design affects millions of hours of human time. That impact shouldn't depend on whether you can afford enterprise software.


Open source changes the equation. Now any engineer can run scenarios. Any architect can test alternatives. Any city planner can validate assumptions. The tool improves through collective use. Edge cases get discovered, models get refined, capabilities expand.


This is how infrastructure tools should work. Not as products you buy, but as knowledge you share and improve.


### The Broader Pattern


Parking simulation is a specific instance of a general problem: we've professionalized analysis to the point of inaccessibility.


Complex tools for complex problems make sense. But many problems aren't complex, they're just numerous. Every parking lot doesn't need a traffic engineering consultant. Every small business doesn't need enterprise software. Every design decision doesn't need a week of analysis.


What they need are tools that match the problem scale. Rigorous enough to be trustworthy. Simple enough to be usable. Accessible enough to be everywhere.


This middle tier of tools is largely missing. We have Microsoft Excel and we have SAP. We have calculators and we have MATLAB. The gap between them is where most real problems live.


### Building Better Infrastructure


The best infrastructure is invisible because it works, not because we don't think about it.


When analysis tools are accessible, infrastructure gets better. Not through grand redesigns, but through thousands of small improvements. The mall that adds a lane before holiday shopping. The hospital that adjusts payment flow during shift changes. The stadium that tests evacuation scenarios before events.


These improvements compound. Better infrastructure reduces friction. Reduced friction saves time. Saved time enables productivity. The effects ripple outward.


But this only happens when the people close to problems have tools to solve them. Not consultants flying in for studies. Not vendors selling solutions. The engineer who sees the queue every morning. The architect designing the next facility. The planner reviewing the proposal.


### What Tools Should Be


Tools encode expertise and make it accessible. A good calculator doesn't just compute, it embodies knowledge about what to compute. A good simulator doesn't just model, it captures understanding about what matters.


The Parking Flow Simulator encodes lessons from Pabellón M and dozens of similar projects. Arrival patterns that matter. Service times that bottleneck. Queuing dynamics that cascade. This knowledge, packaged as code, becomes reusable.


Every parking lot designed with this tool benefits from every parking lot analyzed before it. Knowledge compounds. Solutions spread. Infrastructure improves.


This is what open source infrastructure tools enable: collective learning at societal scale.


### The Invitation


The simulator is available now. Free, open source, MIT licensed. Run it locally or use the hosted version. Extend it for your specific needs. Share improvements back.


GitHub: [https://github.com/rashidazarang/parking-lot-design-simulator](https://github.com/rashidazarang/parking-lot-design-simulator)


If you're designing parking infrastructure, use it. If you see ways to improve it, contribute. If you need features that don't exist, add them or ask for them.


But more importantly, think about the infrastructure problems you see that lack accessible tools. The inefficiencies everyone accepts. The failures everyone works around. The analysis nobody does because it's too expensive.


Build tools for those problems. Make them accessible. Share them openly.


Because infrastructure gets better when the people who understand problems have tools to solve them.


And the best infrastructure isn't just invisible because it works.


It's invisible because it never fails in the first place.

