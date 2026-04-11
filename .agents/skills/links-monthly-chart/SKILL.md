---
name: links-monthly-chart
description: >
  Generates a PNG bar chart showing the number of links created each month for the past 12 months,
  by querying the project's PostgreSQL database. Use this skill whenever the user asks to visualize
  link creation trends, monthly link statistics, link activity over time, or wants a chart/graph of
  how many links were created. Trigger this skill for requests like "show me links per month",
  "chart link creation", "monthly breakdown of links", "how many links were created this year",
  "visualize link activity", or any analytics/reporting request about the links table. Always use
  this skill even if the user just says "plot links" or "graph the data" in the context of this project.
---

# Links Monthly Chart Skill

This skill generates a bar chart PNG showing how many short links were created each month over the last 12 months, pulling data directly from the PostgreSQL database.

## What it does

1. Reads `DATABASE_URL` from the project's `.env` or `.env.local` file
2. Queries the `links` table for rows created in the past 12 months
3. Groups results by calendar month
4. Plots a bar chart (x = month label, y = link count) and exports it as a PNG

## How to use this skill

Run the bundled script from the project root:

```bash
python .agents/skills/links-monthly-chart/scripts/plot_links.py [output_path]
```

- `output_path` is optional. Defaults to `links_monthly_chart.png` in the current directory.
- Example with custom path: `python .agents/skills/links-monthly-chart/scripts/plot_links.py ./reports/links_chart.png`

## Dependencies

The script requires the following Python packages. Install them if not already present:

```bash
pip install psycopg2-binary matplotlib python-dotenv
```

## Expected output

A PNG file with:
- **X axis**: Month labels (e.g. "Apr 2025", "May 2025", ..., "Apr 2026")
- **Y axis**: Integer count of links created that month
- All 12 months shown even if count is zero
- Bar values printed above each bar for readability

## .env file location

The script walks up from the current working directory to find `.env` or `.env.local`. Run the script from the project root (where those files live) to ensure it's found. The `DATABASE_URL` must be a valid PostgreSQL connection string.

## Troubleshooting

- **`DATABASE_URL not found`** — Make sure `.env` or `.env.local` exists and contains `DATABASE_URL=postgres://...`
- **`psycopg2` not installed** — Run `pip install psycopg2-binary`
- **Connection refused** — Confirm the database is reachable from your machine (Neon databases require an internet connection)
