# Data and methodology

The project is a descriptive analysis of Australian public aggregate data, using 2019–2026 snapshots. The figures support a decision narrative for prospective students. They use separate geographic scopes, reporting conventions and source releases.

## Source register

| Input | Scope and version used in the project | Figures | Publisher |
| --- | --- | --- | --- |
| International student monthly summary and data tables | NSW course enrolments and commencements. May year-to-date snapshots for the trend and May 2026 for sector composition. | 1, 5, 6 | [Australian Government Department of Education](https://www.education.gov.au/international-education-data-and-research/international-student-monthly-summary-and-data-tables) |
| International student enrolment and commencement data by ABS SA4 | Disclosed, full-year 2025 course enrolments by Sydney study location and field. | 2, 3 | [Australian Government Department of Education](https://www.education.gov.au/international-education-data-and-research/resources/international-student-enrolment-and-commencement-data-abs-sa4) |
| ASGS Edition 3 digital boundaries | 2021 Statistical Area Level 4 boundaries for the Sydney study-location map. | 2 | [Australian Bureau of Statistics](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs/edition-3-july-2021-june-2026/access-and-downloads/digital-boundary-files) |
| Student Visa Program | National Subclass 500 monthly grant-rate series and selected historical policy events. | 4 | [Department of Home Affairs statistics](https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/study) · [Monthly dataset](https://data.gov.au/data/dataset/student-visas) |
| Consumer Price Index, Australia | Sydney All Groups and Rents CPI. The journals cite the June 2026 release, with observations through May 2026 in the final chart. | 6 | [Australian Bureau of Statistics](https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia/jun-2026) |

The supplied workbook is an evaluation tool. It contains goals, a rubric and self-assessment. This portfolio documents the figure snapshots and their provenance. Exact raw extract filenames, download dates and the original Tableau workbook are unavailable in the supplied materials, which limits independent reproduction.

## Figure notes

### 1. NSW enrolments and commencements

Each series uses January–May year-to-date course registrations. The index divides the reported value by the matching January–May 2019 value for that series, then multiplies by 100. The 2026 endpoints are 108.83 for enrolments and 82.38 for commencements. Enrolments count registrations and can include multiple courses per person. Commencements count course starts, so neither series directly measures unique students entering Australia. The journal prototype included both counts and indices. The interactive version foregrounds the indexed comparison. [Department of Education definitions](https://www.education.gov.au/international-education-data-and-research/international-student-monthly-summary-and-data-tables)

### 2. Sydney study locations

The full-year 2025 choropleth shows reported course enrolments by place of study across the Sydney SA4s shown. The logarithmic colour steps keep the lower end of the count range distinguishable. City and Inner South recorded 223,386 enrolments, 60.1% of the known total shown, and the three leading SA4s together accounted for 85.8%. The percentages use known enrolments as the denominator. Campus locations provide a starting point for further research into housing and travel.

### 3. Study location by field

The heatmap compares disclosed counts across 14 Sydney SA4s and 13 field groups. Colour encodes the count on a logarithmic scale. Each filled cell still displays its original count. Blank cells indicate suppressed or unavailable observations. For example, the City and Inner South Business group has 81,426 disclosed enrolments. In Outer South West, Health has 614 and Business has 48. The colours encode counts across the matrix, so comparing within-area shares would require an additional calculation.

### 4. National student visa grant rate

The Tableau snapshot places the monthly national Subclass 500 grant rate, a three-month moving average and selected policy dates in one view. The two original axes have different ranges and use percentage and decimal labels. Read each series against its corresponding axis. The annotations place the March 2024 Genuine Student requirement, the July 2024 fee increase and the December 2024 introduction of Ministerial Direction 111 in context. MD111 concerned the order of processing offshore applications. The dates provide historical context and the chart supplies neither causal attribution nor an estimate of a person's approval prospects. [Home Affairs visa program report](https://www.homeaffairs.gov.au/research-and-stats/files/student-temporary-grad-program-report-dec-2024.pdf) · [Ministerial Direction 111](https://immi.homeaffairs.gov.au/support-subsite/files/ministerial-direction-111.pdf)

### 5. NSW sector composition

The May 2026 snapshot groups NSW course activity by education sector. Continuing enrolments are total enrolments less commencements. The new share is commencements divided by total enrolments for the sector. Higher Education has 39,571 new and 137,633 continuing registrations out of 177,204, or 22.3% new. VET has 23,413 new registrations out of 83,848, or 27.9% new. ELICOS has a 49.9% new share out of 16,403 total. The interactive story focuses on those three sectors. The underlying Tableau chart also included schools and non-award courses. The categories describe registrations at the reporting cut-off and do not track transitions for individual students.

### 6. Price pressure and enrolments

The chart shows annual means of available observations. The NSW enrolment index uses the corresponding month of 2019 as its baseline. Sydney All Groups CPI and Rents CPI use the June quarter 2019 as their reference. This gives 2019 annual price means of 100.22 and 99.79 respectively. The 2025 means were 116.69 for enrolments, 123.00 for All Groups CPI and 114.88 for Rents CPI. January–May 2026 is partial. Mixed frequencies and baseline definitions make the figure suitable for comparing broad trajectories. Translating price movements into a budget requires actual spending and housing costs.

## Interpretation and evaluation

- **Geography.** Use NSW for the course trend and the sector snapshot, Sydney SA4 for study locations, Sydney CPI for prices and Australia for visa decisions.
- **Privacy.** Retain the publishers' suppression as missing data. The case study uses aggregate observations.
- **Historical context.** The story describes a fixed snapshot. Use current primary sources for application requirements and current costs.
- **Evidence of outcomes.** The four closing actions and the illustrated arrival are persona scenarios. Audience understanding, completion and usefulness remain proposed benchmark measures.
