# Design process and contribution

This is my portfolio account of *The Price of Arrival*, which I developed with the three-person DataLens team. I focused on data preparation, audience framing, narrative design and the sector visualisation in Figure 5.

## How the work evolved

| Stage | Work and decisions | My contribution |
| --- | --- | --- |
| 1. Discovery and data preparation | The team gathered education, visa and price data and explored separate charts. The [value proposition canvas](../artifacts/value-proposition-canvas.jpg) set out what students needed to decide and the challenges each visual could address. Some early concepts included a nationality comparison and a personal budget aid. | I sourced and cleaned data, aligned fields and reporting periods, and designed the canvas. It helped me evaluate whether each comparison resolved a specific audience question. |
| 2. Analysis and visual redesign | We organised the analysis around four reader questions and reduced the number of standalone views. An SA4 map and a region-by-field heatmap answered different geographic questions. The CPI section became a comparison of price pressure. | I developed the narrative rationale, kept track of chart feedback, coordinated ownership across the team and built Figure 5 in Tableau. |
| 3. Audience and story | We developed two research-informed personas, tagged the empathy insights and wrote testable user stories. We sequenced ten illustrated scenes around Mei's decisions and added adviser-facing caption requirements. | I helped define the persona needs and acceptance criteria and connected the insights to figures and storyboard beats. |
| 4. Responsible practice and handover | The final reflection explored respectful treatment of Indigenous Cultural and Intellectual Property as a general design practice. For this project, the relevant data decisions were to keep the analysis aggregate, respect source suppression and use official geographic boundaries with clear place labels. | I reflected on source attribution and the limits of using statistical geography to describe place. |

The journals are represented here through a consolidated portfolio account. The original [HTML story](../index.html), [film](../artifacts/the-price-of-arrival-story.mp4), canvas and [benchmark workbook](../artifacts/story-benchmark.xlsx) carry the team's work forward.

## Figure 5 from data to Tableau

The question was how a sector can account for a large share of the headline total while a relatively small proportion of its enrolments are new courses. I prepared the May 2026 NSW snapshot, calculated continuing enrolments as total enrolments less commencements and divided commencements by enrolments to obtain the new share. The original Tableau export paired the source-country and sector context with the sector composition. The browser story isolates the three sectors used in Mei's decision.

An earlier Sankey linked separate snapshots and suggested a flow the data could not identify. I switched to stacked bars that show the absolute counts, with a percentage label for each sector. In the three-sector comparison, Higher Education leads in total volume at 177,204 enrolments and has the lowest new share at 22.3%. ELICOS has 16,403 enrolments and the largest new share at 49.9%. This makes the distinction between scale and composition visible in one comparison.

## Audience insights and user stories

Mei trusts official statistics and still takes rent and visa anecdotes seriously. We used that tension when writing questions about the intake, location, timing and budget she is considering. Daniel needs to brief clients quickly and keep the definitions and qualifications with each figure. The personas reflect project research and team experience. Interviews were proposed as a future validation step.

| Insight and user story | Evidence and viewer task |
| --- | --- |
| **E1 · Headline and intake**. Mei wants to understand which count reflects new course starts. | **US-M1** · Figures 1 and 5. Explain which line drives the headline and distinguish the total volume from the new share. |
| **E4 · Study location**. Mei wants to shortlist campuses that teach her field. | **US-M2** · Figures 2 and 3. Identify one or two SA4s for further research and describe the geographic scope as place of study. |
| **E2 · Visa timing**. Mei wants to know which historical changes are relevant when she checks her intake and application timing. | **US-M3** · Figures 4 and 5. Locate a policy event and describe what the timeline and sector snapshot each measure. |
| **E3 · Affordability**. Mei wants to understand how much flexibility to allow in her budget. | **US-M4** · Figure 6. Explain how prices changed and why she still needs personal spending estimates. |
| **E5 · Reuse**. Daniel needs to cite a figure with enough context to explain it to clients. | **US-S1 and US-S2** · Figure 5 slide preview and the figure notes. Identify the unit, period, source and limits without the presenter's narration. |

## Ten-scene storyboard

| Scene | Change in Mei's thinking | Evidence |
| --- | --- | --- |
| 1. The headline | She reads a record-high headline and assumes it describes competition for her intake. | Figure 1 sets up the comparison. |
| 2. Two different counts | She distinguishes course enrolments and commencements and asks which measure applies to the question. | Figure 1 |
| 3. Study hubs | Sydney becomes a series of study locations with different levels of activity. | Figure 2 |
| 4. Field fit | She sees that the geographic pattern changes with the field of study. | Figure 3 |
| 5. The visa timeline | She notes selected policy dates and adds a check against official requirements to her plan. | Figure 4 |
| 6. Sector composition | She compares new and continuing registrations in the relevant education sector. | Figure 5 |
| 7. Prices over time | She treats the index as evidence of price pressure and plans to check her own costs. | Figure 6 |
| 8. Putting the factors together | She sees that a viable plan depends on all four dimensions. | Figures 1–6 |
| 9. A plan with her family | She checks timing, narrows the campus search, plans a budget buffer and compares the intake. | Figures 1–6 |
| 10. Arrival | The illustrated outcome completes the persona's decision arc. | The plan from scene 9. |

## Evaluation

The workbook contains eleven self-assessed criteria and proposed checks for comprehension, usefulness and completion. The workbook sets a target of 80% for distinguishing enrolments from commencements and 80% for explaining the CPI limitation. It also proposes recall checks for the three main study hubs and the timeline. These are planned measures. The supplied materials document neither completed participant testing nor observed rates.
