---
id: entendiendo-los-prompts-de-midjourney
path: /blog/entendiendo-los-prompts-de-midjourney.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 7eb88745-7518-486c-8fa8-99d24dcf150d
meta:
  title: Entendiendo los Prompts de Midjourney
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: false
  featured_at:
    - Post Page
  language: Español
  post_type: Post
  status: Not started
  comment: >-
    He generado más de 1,000 imágenes en Midjourney. La mayoría de las personas
    no comprenden cuánto control puedes ejercer para obtener casi exactamente lo
    que puedes imaginar.
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/8c500f01-621b-4ff6-9aff-fb72dd78f0d1/F5NfAobasAAIHlg.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KOVYJQ3%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNC3t7rwF8%2BAUENfgBc6SDYvO4Gow65Eq9cDNPi%2BE83AIhAIBgyqGu8VPWiRt7GdY7BpT0bYaEMofV4VQegLL8QI8PKogECJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyaCYrW3DWuiMdWwEgq3AOHRyDtjr5MAhoLBNj3I4C36JFCakxr5oEdVeDntEoLj%2B0LTu7gfjvARYuBVHJyWD1SC4JRkV44tOn3vCJf3I9eziE1eKUDaQVJjSd1mGO5osLKmuFG%2Bmd2cCT06xBzj1%2FEImbiscdwo0pJYoL%2B8jB9TMmMl%2FdKuzYeuvdMI1pXHDtYq81wty7IYhmqW4QVCK0hqa20VkqTxnvE0goXxRG6z3dz9y8ZmzYsTbgb5gm0XzqTMW5oiqek3RMPL1Dv6c1dw1VE34fFCgnImQleYbNPS2tYfZXx%2F4uKf%2Bzu873C47wesDNmnZDqLNRt3dvuzNXu7OlpRhS2jDD5Oc6WmTEYo1%2FPwH0kAVTGEcuT8brvHB08RG7xW0JILy6PQBjFj16g3CRx2iJufV39TdffVvG4FVFnN5oEBtPFipwyFdNwyWB2ToULoS5cqgwUVG999L1T6M1%2BUc6O%2B8wGnhsJF35dCO3O0na4oB1arATe7cd7xYzg%2FFbPff1VVE3eQjcC3u4lE0HRpI%2BBTnZxZ5AiYlVD7HJZWD4DxUIbXsvBcUD%2FUYWAImjV1fz2rYr4SSI4jEDFzpl9H%2FO7I%2FuHZdty7KAIlzAzGxB26%2BGkWkJWjqlDz%2FSZBkSuZOQVCs2M9jCtmuvPBjqkAZBeLGpgNoGRbc8KxXkps8bh2aO6RUk86TYWE6YmoVz%2FRDo8Z1c%2FXRcKCmayvSiKMFlgKSd%2FSstGGOXRXJJY0WedVHlpbBJEoSKk2olx5zYNQbbBvTBS1ub6BHr%2BxjxbFZ8E6lLKFDUKQ7IiRF%2Fx8F7a%2BNj%2BSfODpE%2B2ehQAdj7a%2BJ15jZG1mVKNd6LFYtr2k8Cm5%2FaYwk3l5gyRGns3XE1IpaYM&X-Amz-Signature=1ce93297f9fa88f4efa36758e1a57fcbc3a8011ba586588596e9bb3874a2cd26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Entendiendo los Prompts de Midjourney


[**← Regresar a Experimentar con IA**](https://www.notion.so/Experimenting-with-Artificial-Intelligence-46b3d0ebd53d4bee933f812549671b01)


# Entendiendo los Prompts de Midjourney


He generado más de 1,000 imágenes en Midjourney. La mayoría de las personas no comprenden cuánto control puedes ejercer para obtener casi exactamente lo que puedes imaginar.


![image](notion:866f1e37-58aa-4313-a196-29d2321934cd)


Estos son los 8 pilares de las instrucciones de Midjourney que DEBES conocer:


## Tokens


Los tokens son el texto que introduces en una instrucción. Cada token que usas tiene un peso asignado, la combinación de los cuales crea la generación final.


Puedes ver cómo se ponderan los tokens en la instrucción usando el comando /shorten --> Mostrar detalles


## Desvanecimiento de la Instrucción


¡Ten cuidado al crear instrucciones largas! La eficacia de la instrucción disminuye cuanto más larga haces tu instrucción.


Esto se puede ver en esta instrucción de anatomía de dragón que hice en v3. Produce buenos dragones, pero quizá no sea el uso más eficiente de tokens.


![image](notion:af91816f-96cb-4abc-b076-9673c8449fe3)


## Multiprompting


Para resolver el problema del desvanecimiento de la instrucción, podemos restablecer la fuerza de una instrucción superponiéndola sobre otra.


Esto se puede hacer separando múltiples instrucciones con el comando :: El peso base de una instrucción se establece en 1. ¡Puedes cambiar este número! Ej. ::2


![image](notion:1305a544-c29b-4078-b47e-d9df5c6eb45e)


## Semillas


Midjourney es como un cine auto generador. Le dices una combinación de tokens, y puede producir la película que quieres ver.


La semilla es el cine en el que elige reproducirse. Si reutilizas esa semilla con los mismos tokens, reproducirá la misma película.


## Reforzamiento


El reforzamiento es la idea de que un token específico puede hacerse más fuerte manipulando aspectos de la instrucción que lo hacen más prominente. Hay varias formas de hacer esto, pero aquí hay una aplicación básica:


Manzana Verde
Verde Verde Manzana


Verde está reforzado.


## Instrucción Negativa


La instrucción negativa en Midjourney es diferente a cualquier otro generador de arte. En resumen, es más abstracta. Hay dos formas de instrucción negativa en Midjourney...


...por extensión
--no [añade lo que no quieres]


...por multiprompting
león:: lindo, anime::-0.5


## Mezcla de Artistas


¿Por qué limitarte al estilo de un artista cuando puedes mezclar más de un artista para crear tu propio estilo?


Puntos extra si aprendes cómo dar instrucciones múltiples a los artistas con pesos específicos para esa capa extra de precisión.


## Andamiaje


La verdadera esencia de mi proceso. El andamiaje es la idea de que podemos darle a Midjourney una pantalla para mirar y ayudarlo a construir sobre ella. Esto se hace dando a Midjourney una imagen y una instrucción. Por ejemplo:


[https://s.mj.run/naRWd4R5b9M](https://s.mj.run/naRWd4R5b9M) — coche de carreras


[Video](https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/120ab047-07cc-4193-8153-3f420044b772/Untitled.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLRIKHRK%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T053734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGLKmzP0mtm4NrPQWW5q4QI%2Bt7zWheGy0%2BVch7JFAh%2BwIhAOoFx12IeZ%2BTCMfKgIzQc6r0zqHlI%2FeQsJU%2FblJlVk%2BxKogECJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwqGoP759KlhjPMBVYq3ANSx0Nk6BIFlmShUXDXHHZytX30wNBI7SpRNPddKLMyEtS8FvPq5lfYaw%2F0suaB5M8ibeCENTz1NnS3nHuAzTRZqqm7qZmg7FnU1ZwSQVN1Iu7iIvQ4kxOyf9jMFef%2Bz35BUrCYIQ9oE7t3ITC8AiStAsTnLqND9xisf9PkgOhwBuVmrwObJfGZKMVlzU%2B8tj8i5U8URSxU3Xa0S4p5hzgzoB%2F0g%2BkOCy7aJLZ23zMxpK8fCMeT%2FVYNk%2BOc4dJG7dE8QOsDUpitwjI%2FVUcCYb9virMuS489yICl7Vas15cKozrsV0ws2AyUnDvI0aGKsr1h%2FY1w%2FnjYxXT1CJgFzCp0nt%2BDx3pQztQhEkTgSfrtMcI6LVDREXT52EIYFBwXrVwyGMVX14fnY1miC67V0kh%2BqNTwGhDS%2FM4ZVAs48xrR2fRXgXE2iDoOavzH85nVbmsneizbTphBcXjlZNqg55xWogtXtV1mRXjuQPZasEZxj2wBcSt9mXt%2FoRwJbUljQXPHyJThsOVjSlffrgvdQMcFKePxB9cF0NXsbIEGCKetkblVXUhyeoJsBQA6ZzNatv7mxZTxUCUsPABifP7CePZvJrAFTTZt2TfmTE92EBEz%2BHnBmCfOtBzCU0RO2jCQmevPBjqkATIajVXhXtMPPW%2FBqLs3UWiQTnE%2B4qg%2FCTWX0u%2BlGLMfh8hNpXidmaTosGxdcWZ5Uia71Frad%2F3fI2ilBu8RdmFRFqj%2FYe2BAE2C7UDyeFUi0vQLwsn%2BV1nAavvsOi3Y9cYfvEHXn%2Bi6q%2FaPOraGK9SpxY26qHyHxdVtD7Yr6pp8%2FWcwjBV7Fs3%2BNC1KtVSBgQblXUIRrltBkYNzU45u7QQeo%2F%2FY&X-Amz-Signature=9168b0866ec76fad5129c7e2908c8c82d75d6b060fe1aaecd79e71f4b61da1a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## **Contacto**


Siempre dispuesto a discutir sobre tecnología, diseño, oportunidades o simplemente la vida en general. No dudes en conectarte a través de [**Email**](mailto:your-email@example.com), [**LinkedIn**](https://chat.openai.com/c/your-linkedin-profile-link), o [**Twitter**](https://chat.openai.com/c/your-twitter-profile-link).


## Sobre mi


He completado dos cursos en línea de Ciencias de la Computación de [**Harvard**](https://www.edx.org/professional-certificate/harvardx-computer-science-for-web-programming?index=product&queryID=1663ce5cd997e216692e6b8f87b715ec&position=4&results_level=first-level-results&term=javascript&objectID=program-90f4789c-2549-4670-ade7-12cc8b590f5c&campaign=Computer%20Science%20for%20Web%20Programming&product_category=professional-certificate&placement_url=https%3A%2F%2Fwww.edx.org%2Fsearch), un certificado profesional de [**Meta**](https://www.coursera.org/professional-certificates/meta-front-end-developer-es) sobre tecnologías Front-end, un curso de IA Generativa de [**Microsoft**](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions) y estoy en camino de obtener una certificación en Diseño UX de [**Google**](https://grow.google/certificates/ux-design/#?modal_active=none). Mi formación académica también incluye una licenciatura en Administración de Negocios del prestigioso [**Tec de Monterrey**](https://conecta.tec.mx/en/news/national/institution/qs-latam-2023-tec-de-monterrey-1-mexico-4-latin-america).


Aspiro a llevar una vida equilibrada, donde cada dominio se alinee armoniosamente, permitiéndome dar lo mejor al mundo. Actualmente estoy explorando la IA Generativa, en especial, el potencial del audio como la próxima interfaz informática.


---

<details>
<summary>Hidden Pages</summary>

[heap](https://www.notion.so/c732e1f6f5ea45f89e7e97fb6e94b9cf) 


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

