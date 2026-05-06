---
id: why-your-ai-agent-sucks-at-front-end
path: /blog/why-your-ai-agent-sucks-at-front-end.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 27152116-a8b1-8052-8406-e69f5d99bf18
meta:
  title: Why Your AI Agent Sucks at Front-End
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
  comment: 'Date: September 17, 2025'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/ffe7809f-8554-4d28-a3cc-ccfcad3101bf/cover-image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLDPL5B%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS9YLGGcm9E0uIl7QO2yZWZjAGZtHLlCw%2F9vnP52aE5AiAbgs0weKWnNfDRK4%2B3X8Qou7pTtVSP23CkJDHhZgcgZSqIBAiW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNEIZPBevXccxIaYVKtwDO8RZbxim0MXQZMmswKm1F8hTAZuNKh987qTD3n5lMlP9xFYE8sQgPDrHThxaIn6jnwH6bn8xfavQLJ44LyjOGOudDMZf8RzyYRPKYxJuJCj14ttkXaEFYxuMhHHdkSPjlgj7xVMDxKXFd%2FZ8upF1qkVhTaSYhgISc3GRFDR2uP1LE8Za4bAQQ7g94ef066y9Ag3RxifslBAElBjzs2qOHg6MLrqab0O5guTZ%2FrBmtIMMHkmukYBPcKvYDmzKr5vGkIjYYmXykdAZ%2F0BYpFp5NLUUFB3gWhMDdPagDGy0Ccz%2BnxJbw19b3ALtPCsNONy%2BgQomQRV16vGW4Q7lZ4GsrY%2BrTBjwzuyPN5aEAVg0qyN7cKDz%2BhR5K19helFhuqWbvJk3W%2FmHV%2FF7Dvet1MLV%2BhrDpBvnW5Xs9nzQnQy7W73pl3oaOO3BM4U48G3THvx7%2FFtwBoUDdHsGkqDGKfPPTORoS5c8C8ZDb98keHl%2Bfl9A1wjrGpPGUwNDI8jPPuL%2BP%2FqydW11kMZlMYKsKNyamZysXPBNKdDfOASDaWXWAZChy5JsKGsq2UHDVOg70WrgXYic0tt3VZ57vL4TLkRIny%2Bpbw1PVEV%2BBeDwCufKa%2BlDL1OQW7WjlgVHOMcwr5jrzwY6pgEUH41GlggxDic4J9X03lYHTYhNp7%2FyekI6tPmBjZC47xn8QUfeD4sBIEyDe%2FKD%2BNz7kiyf%2BahH1VCCDf5x%2BJeaMcomsrAmwOhpy8nSfaI728xGqUGflmigaaSDHun%2BwxP7R8LI3xHysoGXCiqo3zr66SEoN%2BFI8FrGqfq57FCedm97mLEEUKvcokY3qPpMI5%2FFxe8Hgx%2BQEJ4S7tR%2FeQxtHnXPIUCS&X-Amz-Signature=162468981fe1e77a90d62ff1ee6d5964778ebfe94f48c0f41923fea11039bbfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Why Your AI Agent Sucks at Front-End


[**← Go back**](/86c9f77657a2461ba3e5f2d8fccdcf04)


## Why Your AI Agent Sucks at Front-End


**Date:** September 17, 2025


When you ask Claude Code or Cursor to build a UI, you usually get one of two things: either the generic shadcn purple template everyone else gets, or something that's technically correct but visually off in ways that are hard to articulate.


![image](notion:27152116-a8b1-80a6-9242-feb61e9f4c46)


---


### The Specific Problem


Front-end development is inherently visual. When a human developer builds a UI, they're constantly looking at it. Write some CSS, check the browser. Adjust the padding, check again. Move that button, see how it feels.


AI coding agents can't do this by default. They write HTML and CSS blind, based entirely on patterns they've learned from code. They can follow Bootstrap documentation perfectly, but they can't tell if that gradient actually looks good or if the mobile layout is broken.


![image](notion:27152116-a8b1-8026-9f0e-e16dab963683)


This is fine for backend work. When you're writing API endpoints or data processing logic, the code itself contains all the information. But front-end work has this awkward split: the instructions are in code, but the output is visual.


---


### A Partial Solution


The obvious fix is to give AI agents the ability to see what they're building. Browser automation tools like Playwright make this possible.


![image](notion:27152116-a8b1-80b7-a7b7-c41503e774bd)


Playwright has an MCP (Model Context Protocol) integration that lets Claude Code and other agents control browsers and capture screenshots. Once you add it, the agent can:

- Open what it's building in a browser
- Take screenshots at different viewport sizes
- Check console errors
- Compare the visual output against requirements

This closes the feedback loop. Instead of guessing whether that flexbox layout worked, the agent can look. Instead of assuming the mobile version is fine, it can check.


---


### What This Actually Gets You


Let's be realistic about what this does and doesn't do.


It does help with:

- Catching obvious visual bugs (overlapping elements, broken layouts)
- Iterating on designs based on what's actually rendering
- Mobile responsiveness testing
- Debugging issues that only show up visually
- Comparing output against design mockups or references

It doesn't magically make Claude a great designer. You still need to provide clear design direction, whether that's mockups, style guides, or detailed descriptions. The model isn't going to suddenly develop taste.


What it does is remove a specific bottleneck: the iteration loop where you keep telling the agent "no, that's not right, try again" without it understanding what's wrong visually.


---


### The Iteration Loop


The real value comes from letting the agent iterate on its own work. Set up a workflow where it:

1. Builds something
2. Takes a screenshot
3. Compares against requirements
4. Identifies issues
5. Fixes them
6. Repeats

This is especially powerful when you have clear validation criteria - a design mock, specific requirements, or examples of what you want. The agent can work through multiple iterations without your constant intervention.


Without visual feedback, you might spend 30 minutes going back and forth trying to describe what's wrong. With it, the agent can often identify and fix issues on its own.


---


### Practical Workflows


Here are the most valuable workflows this enables:

1. **Agentically iterate on front-end via screenshots/logs** - producing much better UIs
2. **Automatically fix UI errors and console errors** - catch issues before you see them
3. **Navigate browser to reproduce error states** - look for bugs, gather context, submit form data
4. **Visually render and screenshot reference URLs** - use existing designs as inspiration
5. **Automated testing and accessibility audits** - catch issues systematically
6. **Mobile responsive design testing** - verify layouts across devices
7. **Data scraping and browser automation** - beyond just design work
8. **Turn Claude Code into a browser-based agent** - unlock new capabilities

---


### The Orchestration Layer


The key to making this work is proper orchestration. You need:

- **Context**: Well-written prompts, documentation, codebase
- **Tools**: Playwright MCP, grep, web search, other MCPs
- **Validators**: Acceptance criteria, style guides, UI mocks

When you combine these elements, the agent has everything it needs to succeed. It's not just about adding tools; it's about creating an environment where the agent can work effectively.


---


### A Real Example: Design Review Agent

<details>
<summary>**Click to see a complete Design Review Agent configuration**</summary>

---


## Design Review Agent Configuration


### Your Review Process


You will systematically execute a comprehensive design review following these phases:


### Phase 0: Preparation

- Analyze the PR description to understand motivation, changes, and testing notes (or just the description of the work to review in the user's message if no PR supplied)
- Review the code diff to understand implementation scope
- Set up the live preview environment using Playwright
- Configure initial viewport (1440x900 for desktop)

### Phase 1: Interaction and User Flow

- Execute the primary user flow following testing notes
- Test all interactive states (hover, active, disabled)
- Verify destructive action confirmations
- Assess perceived performance and responsiveness

### Phase 2: Responsiveness Testing

- Test desktop viewport (1440px) - capture screenshot
- Test tablet viewport (768px) - verify layout adaptation
- Test mobile viewport (375px) - ensure touch optimization
- Verify no horizontal scrolling or element overlap

### Phase 3: Visual Polish

- Assess layout alignment and spacing consistency
- Verify typography hierarchy and legibility
- Check color palette consistency and image quality
- Ensure visual hierarchy guides user attention

### Phase 4: Accessibility (WCAG 2.1 AA)

- Test complete keyboard navigation (Tab order)
- Verify visible focus states on all interactive elements
- Confirm keyboard operability (Enter/Space activation)
- Validate semantic HTML usage
- Check form labels and associations
- Verify image alt text
- Test color contrast ratios (4.5:1 minimum)

### Phase 5: Robustness Testing

- Test form validation with invalid inputs
- Stress test with content overflow scenarios
- Verify loading, empty, and error states
- Check edge case handling

### Phase 6: Code Health

- Verify component reuse over duplication
- Check for design token usage (no magic numbers)
- Ensure adherence to established patterns

### Phase 7: Content and Console

- Review grammar and clarity of all text
- Check browser console for errors/warnings

---


### Your Communication Principles

1. **Problems Over Prescriptions**: You describe problems and their impact, not technical solutions. Example: "The spacing feels inconsistent with adjacent elements, creating visual clutter."
2. **Triage Matrix**: You categorize every issue:
    - **[Blocker]**: Critical failures requiring immediate fix
    - **[High-Priority]**: Significant issues to fix before merge
    - **[Medium-Priority]**: Improvements for follow-up
    - **[Nitpick]**: Minor aesthetic details (prefix with "Nit:")
3. **Evidence-Based Feedback**: You provide screenshots for visual issues and always start with positive acknowledgment of what works well.

---


### Your Report Structure


```markdown
### Design Review Summary
[Positive opening and overall assessment]

### Findings

#### Blockers
- [Problem + Screenshot]

#### High-Priority
- [Problem + Screenshot]

#### Medium-Priority / Suggestions
- [Problem]

#### Nitpicks
- Nit: [Problem]
```


---


### Technical Requirements


You utilize the Playwright MCP toolset for automated testing:

- `mcp_playwright_browser_navigate` for navigation
- `mcp_playwright_browser_click/type/select_option` for interactions
- `mcp_playwright_browser_take_screenshot` for visual evidence
- `mcp_playwright_browser_resize` for viewport testing
- `mcp_playwright_browser_snapshot` for DOM analysis
- `mcp_playwright_browser_console_messages` for error checking

You maintain objectivity while being constructive, always assuming good intent from the implementer. Your goal is to elevate the user experience while balancing perfectionism with practical delivery timelines.


---


</details>


---


### When This Matters


This is most valuable when:

- You're prototyping UIs quickly
- You need to match a specific design
- You're debugging visual issues
- You're testing responsive layouts
- You're working with complex layouts or animations

It's less useful for:

- Backend development (obviously)
- Simple CRUD interfaces where the default templates are fine
- Projects with established component libraries where everything's already figured out
- When you just need functional HTML, not polished design

---


### Getting Started


To set this up:

1. Install the [Playwright MCP](https://github.com/microsoft/playwright-mcp)
2. Add visual validation instructions to your [claude.md](http://claude.md/) or cursor rules
3. Include screenshot requirements in your prompts

For more advanced setups, check out the [Playwright Agents documentation](https://playwright.dev/agents) which covers configuration options, best practices, and advanced workflows.


---


### Should You Do This?


If you regularly use AI agents for front-end development and find yourself frustrated with the visual output, yes, try it. The setup cost is minimal and the improvement is real.


If you mostly do backend work, or you're happy with component libraries and standard templates, skip it.


The point isn't that everyone needs browser automation. It's that when there's a specific mismatch between what the agent can perceive and what it needs to do, adding the right tool helps. Front-end development needs visual feedback. This provides it.


---


## More about me


My aim is to live a balanced and meaningful life, where all areas of my life are in harmony. By living this way, I can be the best version of myself and make a positive difference in the world.

Professionally, I focus on the design and implementation of cognitive infrastructure: systems that make complex enterprise data usable through AI-powered tools and human-like interaction.



[**About me →**](https://rashidazarang.com/personal)


---


## Similar blog posts


Untitled


---

