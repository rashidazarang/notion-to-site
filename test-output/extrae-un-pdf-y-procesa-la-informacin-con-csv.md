---
id: extrae-un-pdf-y-procesa-la-informacin-con-csv
path: /blog/extrae-un-pdf-y-procesa-la-informacin-con-csv.md
type: essay
intent: reference
version: '1.0'
created: '2026-05-06'
last_updated: '2026-05-06'
source:
  platform: notion
  page_id: 11b52116-a8b1-80ba-8aa7-ecd7f2c3a8b6
meta:
  title: Extrae un pdf y procesa la información con CSV
  author: Rashid Azarang
  category: []
  main_tag: null
  tags: []
  featured: false
  featured_at:
    - Home Page
  language: Español
  post_type: Post
  status: Not started
  comment: 'Oct 9, 2024'
  cover_image: >-
    https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/1f7a4ff9-9c4c-4318-8c52-ead8e7c53075/DALLE_2024-10-09_18.42.34_-_An_abstract_but_illustrative_image_representing_the_process_of_extracting_and_processing_information_from_PDFs_to_CSV_using_AI._The_image_includes_ico.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XED3JBMC%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T052726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDmYlw1jQjWPNfXbXV1YBuzJDtgg8l%2FgSTIhb2m%2BScwMgIgALUwx3PpqbJV%2Bz%2FhcWeQKfw2%2B%2F9sZpkSfHraYMYPxVEqiAQIlv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDPhEc6yWwqnqPv2lCrcA5Z8wZhpE0W9P4gpwy%2F8fOCIu64%2FZ1W5Wkszf2q%2BN2FVcdfUP4ZU4GKlncQQ%2BjbGveaVwirg3452tr0sHUfOjsX49E%2F4FULzvRPRces%2F8hykQkeylZEgmsZfzGwmIY4HSF7CwqEVwLFwv3uUNuudkXevGek08E7CjxBebK7vCA27Z5crrsRCb9RRqu54c3TgwOMrtAfOr%2BnCuqOQ5CPR%2F1MOx4RF427qq0uU3m%2F36V0%2FOoTjtCnunoVEsTiiAM8ow6CCl0BBmyFdl0sQYCrzo3DX8OalbTxirH57xWyl1k217BE2fJfOgVTUylzs4hUKYitb7w4m%2Ft6f%2B0IKJ7IZQSO4JqWAYN0HXT23550o5uXtOAVRSWWlSKnxK3LUDLW6jxfa3YQRNtGk5M%2F06rNeflIyupkDrNRKSklXPN3HFROShzpJb%2Fx9%2FWFe3RC2jTWcJD0E3u9h6gQ2w1qrkA83mvGj8cp4tjf1ds%2BmbJVONaDhzklNCqxkS%2FTVE5q7%2FY54cuSngRtdtYi1S20G7WYnAZSMVzC1YD533Ckj1vO1a%2FIq1d4o9%2FJ7PuKB1CPTdwn%2BHdX9j4muz%2F4R6RQUYcaXRXra3RH%2BdJ76g5bbvgvfB3ESQHjDF7H%2BFFpKyHR2MNeY688GOqUBT0O02Gj47DwayArOYiaHeI7%2FjhT%2BmMtdiHOcpO%2FbDpYVNTpwzevlKKLutZ541o3uTy5czhtNF3Mw7VH8gxUnEHHxovn5ZjCdQgxRzwML8ISzO%2BC46TAD52NhPu43gfkEWQSbkmpwpb4%2BAwsarK%2B2TBU%2BxTeSOA1WIbUTPVug6auVmCMZyqeqscHWwm0lHv1e6HMjm%2B5NPcRvq99zt7MaLyAEAqPW&X-Amz-Signature=75d14f1b3200a74507d97d1e23b7205a9791658842268a0595a5d0076e3051ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
---

# Extrae un pdf y procesa la información con CSV


## **Extraer y procesar información de PDF a CSV (Con AI)**


Oct 9, 2024


![image](notion:c14cd724-ec6b-4d2f-ba8f-c63d893edcc9)


## **1. Objetivo:**


Automatizar la extracción de información contenida en PDFs con eventos categorizados y exportarla en formato CSV, compatible con nuestra base de datos en Airtable, para integrarla fácilmente con otros procesos internos.


## **2. Herramientas Utilizadas:**

- **ChatGPT 4.0:** Para la interpretación y procesamiento del texto.
- **OCR (Reconocimiento Óptico de Caracteres):** Tecnología utilizada para extraer texto de imágenes dentro de los PDFs.
- **Airtable:** Base de datos para almacenar e integrar la información procesada desde los CSVs.

## **3. Proceso de Extracción de Información:**


### **Paso 1: Cargar el PDF**


Cargamos un archivo PDF que contiene la información de eventos (en este caso, el archivo PMIS.pdf). El PDF puede contener texto directamente o imágenes con texto, por lo que se puede usar OCR para extraer la información de imágenes si es necesario.


### **Paso 2: Especificar las columnas deseadas**


Para comenzar el proceso de extracción, se define una estructura básica de columnas. En este caso, solicitamos las siguientes columnas para generar el CSV:


```javascript
Genera un CSV con toda la información de los eventos. Columnas a incluir:

- Dia de la semana
- Mes
- Titulo
- Horario
- Expositor
- Ubicación
```


### **Paso 3: Extracción de la información**


El modelo extrae la información relevante del PDF y la organiza en las columnas solicitadas. Por ejemplo:


| Dia de la semana | Mes | Titulo | Horario | Expositor | Ubicación |
| --- | --- | --- | --- | --- | --- |
| Lunes | Octubre | Vinyasa Yoga | 19:30 | Cecilia Villarreal | Explanada Verde |
| Martes | Octubre | Club de Literatura | 19:00 | Andrea Romero | Salón Multiusos |
| Miércoles | Octubre | Meditación Guiada | 19:30 | Cynthia Reyes Pérez | Explanada Verde |


### **Paso 4: Agregar más información (Descripción y Sinópsis)**


A continuación, solicitamos que se agreguen más detalles para enriquecer la información, como una sinopsis general y descripciones específicas por evento. Esto permite tener datos más útiles para quienes visualizan la información en Airtable u otros sistemas.


**Prompt Utilizado:**


```javascript
Perfecto, ahora incluye dos columnas. Una donde coloques una sinópsis, son encuentros sin costo organizados por gobierno para la ciudadania. y la segunda colocas más información breve como una descripción adicional.
```


El resultado es una tabla enriquecida, con las siguientes columnas adicionales:


| Dia de la semana | Mes | Titulo | Horario | Expositor | Ubicación | Sinópsis | Descripción adicional |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lunes | Octubre | Vinyasa Yoga | 19:30 | Cecilia Villarreal | Explanada Verde | Encuentros sin costo organizados por el gobierno. | Clase de yoga al aire libre con enfoque en Vinyasa. |
| Martes | Octubre | Club de Literatura | 19:00 | Andrea Romero | Salón Multiusos | Encuentros sin costo organizados por el gobierno. | Reunión semanal para discutir literatura contemporánea. |


### **Paso 5: Exportar a CSV**


Finalmente, exportamos el archivo en formato CSV, que es compatible con Airtable, y otros sistemas que utilizan este formato para cargar datos.


---


## **4. Aplicaciones Prácticas:**


Este proceso permite automatizar la carga de eventos, organizados de manera clara y estructurada, a una base de datos sin la intervención manual de copiar y pegar cada uno de los datos. Adicionalmente, se puede integrar la generación automática de descripciones y otros textos complementarios utilizando AI para proporcionar contexto adicional a los eventos.


## **5. Casos de Uso con Otros PDFs (Imágenes y Texto):**


Este mismo proceso se puede replicar con otros tipos de archivos, como los mencionados en los ejemplos proporcionados:

- [PBOS.pdf](https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/0faa7c9d-961d-4922-b434-d5ae4cb5027f/PBOS.pdf)
- [PCAP.pdf](https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/3e4c8f13-38b5-4c94-afa2-082fdc5bf170/PCAP.pdf)
- [PMIR.pdf](https://prod-files-secure.s3.us-west-2.amazonaws.com/8eaec1b3-5799-4f89-9397-3edac82a79d6/33d2f259-8fd7-4b9b-9403-3590f58163c8/PMIR.pdf)

Estos archivos pueden contener información categorizada que se puede extraer y estructurar usando el mismo procedimiento descrito anteriormente. Además, si los PDFs contienen imágenes con texto, se puede aplicar OCR para extraer ese texto antes de procesarlo.


---


## **6. Ventajas de este Proceso:**

- **Ahorro de tiempo** al evitar el procesamiento manual de documentos.
- **Estandarización** de la información en un formato compatible con Airtable.
- **Flexibilidad** para añadir o modificar columnas y detalles de forma dinámica.

Este proceso de automatización puede ser reutilizado para diversos tipos de eventos, cursos o encuentros sin importar su origen, siempre que la información sea procesada en PDFs o imágenes que contengan texto estructurado.


---

