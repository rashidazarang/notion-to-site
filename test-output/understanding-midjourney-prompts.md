---
id: understanding-midjourney-prompts
path: /blog/understanding-midjourney-prompts.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: a3227ecc-1bd5-41b5-a487-20c2ff97e898
meta:
  title: Understanding Midjourney Prompts
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: false
  featured_at:
    - Post Page
  language: English
  post_type: Post
  status: Not started
  comment: >-
    I've generated over 1,000 images in Midjourney. Most people don't understand
    just how much control you can leverage to get near exactly what you can
    imagine.
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/8c500f01-621b-4ff6-9aff-fb72dd78f0d1/F5NfAobasAAIHlg.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KOVYJQ3%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNC3t7rwF8%2BAUENfgBc6SDYvO4Gow65Eq9cDNPi%2BE83AIhAIBgyqGu8VPWiRt7GdY7BpT0bYaEMofV4VQegLL8QI8PKogECJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyaCYrW3DWuiMdWwEgq3AOHRyDtjr5MAhoLBNj3I4C36JFCakxr5oEdVeDntEoLj%2B0LTu7gfjvARYuBVHJyWD1SC4JRkV44tOn3vCJf3I9eziE1eKUDaQVJjSd1mGO5osLKmuFG%2Bmd2cCT06xBzj1%2FEImbiscdwo0pJYoL%2B8jB9TMmMl%2FdKuzYeuvdMI1pXHDtYq81wty7IYhmqW4QVCK0hqa20VkqTxnvE0goXxRG6z3dz9y8ZmzYsTbgb5gm0XzqTMW5oiqek3RMPL1Dv6c1dw1VE34fFCgnImQleYbNPS2tYfZXx%2F4uKf%2Bzu873C47wesDNmnZDqLNRt3dvuzNXu7OlpRhS2jDD5Oc6WmTEYo1%2FPwH0kAVTGEcuT8brvHB08RG7xW0JILy6PQBjFj16g3CRx2iJufV39TdffVvG4FVFnN5oEBtPFipwyFdNwyWB2ToULoS5cqgwUVG999L1T6M1%2BUc6O%2B8wGnhsJF35dCO3O0na4oB1arATe7cd7xYzg%2FFbPff1VVE3eQjcC3u4lE0HRpI%2BBTnZxZ5AiYlVD7HJZWD4DxUIbXsvBcUD%2FUYWAImjV1fz2rYr4SSI4jEDFzpl9H%2FO7I%2FuHZdty7KAIlzAzGxB26%2BGkWkJWjqlDz%2FSZBkSuZOQVCs2M9jCtmuvPBjqkAZBeLGpgNoGRbc8KxXkps8bh2aO6RUk86TYWE6YmoVz%2FRDo8Z1c%2FXRcKCmayvSiKMFlgKSd%2FSstGGOXRXJJY0WedVHlpbBJEoSKk2olx5zYNQbbBvTBS1ub6BHr%2BxjxbFZ8E6lLKFDUKQ7IiRF%2Fx8F7a%2BNj%2BSfODpE%2B2ehQAdj7a%2BJ15jZG1mVKNd6LFYtr2k8Cm5%2FaYwk3l5gyRGns3XE1IpaYM&X-Amz-Signature=1ce93297f9fa88f4efa36758e1a57fcbc3a8011ba586588596e9bb3874a2cd26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Understanding Midjourney Prompts


[**← Back to Experimenting with AI**](/46b3d0ebd53d4bee933f812549671b01)


# Understanding Midjourney Prompts


I've generated over 1,000 images in Midjourney. Most people don't understand just how much control you can leverage to get near exactly what you can imagine.  


![image](notion:67af3f54-f093-49bf-b9d3-aa673286033c)


---


Here are 8 pillars of Midjourney prompts that you MUST know:


## Tokens


Tokens are the text that you input in a prompt. Each token that you use has a weight assigned it, the combination of which make the final generation.


You can see just how the tokens in the prompt are weighted by using the /shorten command --> Show details


## Prompt Decay


Be careful when creating long prompts! The effectiveness of the prompt has diminishing returns the longer you make your prompt.


This can be seen in this dragon anatomy prompt I made in v3. Makes some good dragons, but might not be the most efficient token use


![image](notion:32e954dd-3cfd-43ef-bff1-787e79bf1a5c)


## Multiprompting


To solve the issue of prompt decay, we can reset the strength of a prompt by layering it on top of another.


This can be done by separating multiple prompts with the command :: The base weight of a prompt is set to 1. You can change this  number! Ex - ::2


![image](notion:60d28976-7747-4243-93b8-70c04d87683a)


## Seeds


Midjourney is like a self generating movie theater. You tell it a combination of tokens, and it can produce the movie that you want to see.


The seed is the theater that it chooses to play in. If you reuse that seed with the same tokens, it will play the same movie.


## Reinforcement


Reinforcement is the idea that a specific token can be made stronger by manipulating aspects of the prompt that make it more prominent. There are several ways of doing this, but here's a basic application:


Green Apple
Green Green Apple


Green is reinforced.


## Negative Prompting


Negative Prompting in Midjourney is different than any of art generator. Put shortly, it's more abstract. There are two ways to negative prompt in Midjourney...


...by extension
--no [add what you don't want]


...by multiprompting
lion:: cute, anime::-0.5


## Artist Mixing


Why limit yourself to an artist's style when you can mix more than one artist to make your own style!



Bonus points if you learn how to multiprompt artists with specific weights for that extra layer of precision.


## Scaffolding


The true bread and butter of my process. Scaffolding is the idea that we can give Midjourney a screen to look at to help it build upon. This is done by giving Midjourney an image and prompt. For example:


[https://s.mj.run/naRWd4R5b9M](https://t.co/VgFMPsF8So) — racecar


[Video](https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/120ab047-07cc-4193-8153-3f420044b772/Untitled.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG6DVIUC%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDeteCJssC3MJV3%2BW8Klt0op4OnuFqgv8v4SK8ig3wniwIgQzYl8HpWn28h75PG82hFn6c3iQP9xqyxeh5i5K6NSbAqiAQIlv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGj3NnAPW8dMEXgsLircA99%2BY26%2FaQzMkID8uJL1Jq3u0wNPCe7253%2B94CiXJHBqFAS3MZL63Kd8Fg7zDCyQ55rzb4K%2BMh4HvaXdtglriIu%2B9ybSAswDWX02lKh7R5S2QowGKTKzxgVpWIP6%2FQOYFF3kUPCOoN%2FTVIZVX%2BOkVeooPJ4%2FHVSSPPPzUBX9SAgi4czL5nWtQw0OTsN8QIXRTRbPBcSQEMowLIbFSOuWTG85XdVWbHZn3tYwW7vjJVHKCHgpXD3Q7fkT%2BMSALMVngW3S8NkglCoGTrpDT8107oUTQMyV9ZhK%2BBUxvM2Fw4wU41%2FWFAVPDqESZ3ywgyHxz1S5nBSUFs840ASfBs8gp7cNMR4YkLR8zyyC6Afe5kWnMWBoRx1cwFZUWU0R%2BvB8Ld%2B1jVpOcr9VakI9W6BPnDQZ627tGafDHLoEHOmz9JY4bJid9B7LHJHZyox9Be42sXu%2B8Fvd9q%2Ba9ngs%2F1o2ab2TjVgOaFxjH2k5f6l2MQwwn9PjPiSLs51oivQRrQlxNxWjal0O6G8M%2BpZu%2F%2BWR5FX9nQXHPwgbla%2FynhKQ55NaRBEwvFIqD1ZuxV40GEBX1VxmHu213iAP56WE30wRUrPRLoKeb7zO%2BqfnuSCyO78VSrt1uI8Jh50mOu%2B4MJqa688GOqUBQCccLu%2BWtWUyQc2ptxH1djAQ4Uz6FjM5BLHKOE6Q%2BSvn41%2BGHym4huCWR3Y3SZJ3BlU7Bretbus43YX3Oc01DFMNOBQKqB96ZiFYYCzqq9dOo1d6ieJLbEeF8JwtD5jUUl3miS0DEmCQFnct2BdLRIMa6UjwPiHWXZO7tZXMJSa0gvSnuwOvkLcgRDnh6yMyvUSv5MdBmMW5p70aXobF%2FTShuy48&X-Amz-Signature=027ec391ee5829cf919358a672471da9fe2ac9d13f67a8a2d3acdfb107f5a776&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## **Reach Out**


Always open to discussing tech, design, opportunities, or just life in general. Feel free to connect via [**Email**](mailto:your-email@example.com), [**LinkedIn**](https://chat.openai.com/c/your-linkedin-profile-link), or [**Twitter**](https://chat.openai.com/c/your-twitter-profile-link).


## More about me


I’ve completed two online Computer Science courses from [Harvard](https://www.edx.org/professional-certificate/harvardx-computer-science-for-web-programming?index=product&queryID=1663ce5cd997e216692e6b8f87b715ec&position=4&results_level=first-level-results&term=javascript&objectID=program-90f4789c-2549-4670-ade7-12cc8b590f5c&campaign=Computer%20Science%20for%20Web%20Programming&product_category=professional-certificate&placement_url=https%3A%2F%2Fwww.edx.org%2Fsearch), a professional certificate from [Meta](https://www.coursera.org/professional-certificates/meta-front-end-developer-es) on Front-end technologies, a Generative AI course from [Microsoft](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions) and I'm on track to earn a UX Design certification from [Google](https://grow.google/certificates/ux-design/#?modal_active=none). My academic background also includes a Business degree from the reputable [Tec de Monterrey](https://conecta.tec.mx/en/news/national/institution/qs-latam-2023-tec-de-monterrey-1-mexico-4-latin-america).


I aspire to lead a balanced life, where every domain aligns harmoniously, enabling me to give my best to the world. I’m currently exploring Generative AI, the potential of audio as the next-gen computer interface, and the evolving landscape of AI Companions.


---

<details>
<summary>Hidden Pages</summary>

[heap](https://www.notion.so/4d29a20744bd48029e32b1260abaec3b) 


> 👀  Review availability →


P.S. The AI Audience Accelerator video course relaunches soon.


It'll teach you:

- How to get AI to write content like YOU
• How to create 1 week’s worth of content in 1 hour
• AI systems that skyrocketed my audience to 115k+

Join the waitlist here:


If you got this far, you'd love my in-depth emails.


As a solopreneur, I share the best AI:

- Tools
• Prompts
• Workflows

To help you 10x your productivity.


Join 20k+ solopreneurs for free here:


</details>

