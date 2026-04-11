#!/usr/bin/env python3
"""
Plot a bar chart of links created per month for the past 12 months.

Reads DATABASE_URL from the nearest .env or .env.local file found by
walking up from the current working directory.

Usage:
    python plot_links.py [output_path]

    output_path  Optional. Destination for the PNG file.
                 Defaults to links_monthly_chart.png in the cwd.
"""

import os
import sys
import datetime
from pathlib import Path

try:
    import psycopg2
except ImportError:
    sys.exit("Missing dependency: run  pip install psycopg2-binary")

try:
    import matplotlib
    matplotlib.use("Agg")  # non-interactive backend — works without a display
    import matplotlib.pyplot as plt
    import matplotlib.ticker as ticker
except ImportError:
    sys.exit("Missing dependency: run  pip install matplotlib")

try:
    from dotenv import load_dotenv
except ImportError:
    sys.exit("Missing dependency: run  pip install python-dotenv")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def find_env_file() -> Path:
    """Walk up from cwd to find the first .env.local or .env file."""
    current = Path(os.getcwd()).resolve()
    for directory in [current, *current.parents]:
        for name in (".env.local", ".env"):
            candidate = directory / name
            if candidate.exists():
                return candidate
    raise FileNotFoundError(
        "Could not find a .env or .env.local file. "
        "Run this script from the project root directory."
    )


def get_database_url() -> str:
    env_file = find_env_file()
    print(f"Loading environment from: {env_file}")
    load_dotenv(env_file, override=False)
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise ValueError(
            f"DATABASE_URL is not set in {env_file}. "
            "Add  DATABASE_URL=postgres://...  to that file."
        )
    return url


def query_monthly_counts(db_url: str) -> list[tuple]:
    """
    Return a list of (datetime, count) rows representing links created per
    calendar month for the past 12 months.
    """
    conn = psycopg2.connect(db_url)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    DATE_TRUNC('month', created_at AT TIME ZONE 'UTC') AS month,
                    COUNT(*)::int AS count
                FROM links
                WHERE created_at >= NOW() - INTERVAL '12 months'
                GROUP BY month
                ORDER BY month
                """
            )
            return cur.fetchall()
    finally:
        conn.close()


def build_month_series(rows: list[tuple]) -> tuple[list[str], list[int]]:
    """
    Build ordered labels and counts for the last 12 complete calendar months
    including the current month, filling in zeros for months with no links.
    """
    today = datetime.date.today()

    months: list[datetime.date] = []
    for delta in range(11, -1, -1):
        # Go back 'delta' months from today
        year = today.year
        month = today.month - delta
        while month <= 0:
            month += 12
            year -= 1
        months.append(datetime.date(year, month, 1))

    # Map query results to date keys
    counts: dict[datetime.date, int] = {}
    for month_dt, count in rows:
        key = datetime.date(month_dt.year, month_dt.month, 1)
        counts[key] = int(count)

    labels = [m.strftime("%b %Y") for m in months]
    values = [counts.get(m, 0) for m in months]
    return labels, values


def plot_chart(labels: list[str], values: list[int], output_path: str) -> None:
    fig, ax = plt.subplots(figsize=(14, 6))

    x_positions = range(len(labels))
    bars = ax.bar(
        x_positions,
        values,
        color="#4F46E5",
        edgecolor="white",
        linewidth=0.6,
        width=0.65,
    )

    # Axes formatting
    ax.set_xticks(list(x_positions))
    ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=10)
    ax.set_ylabel("Links Created", fontsize=12, labelpad=10)
    ax.set_title(
        "Links Created per Month — Last 12 Months",
        fontsize=14,
        fontweight="bold",
        pad=14,
    )
    ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    ax.set_ylim(bottom=0)
    ax.grid(axis="y", linestyle="--", alpha=0.4, zorder=0)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    # Value labels above each bar
    for bar, val in zip(bars, values):
        if val > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(values) * 0.01 + 0.05,
                str(val),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#111827",
            )

    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Chart saved to: {output_path}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    output_path = sys.argv[1] if len(sys.argv) > 1 else "links_monthly_chart.png"

    print("Step 1/3 — Reading DATABASE_URL …")
    db_url = get_database_url()

    print("Step 2/3 — Querying database …")
    rows = query_monthly_counts(db_url)

    labels, values = build_month_series(rows)
    total = sum(values)
    print(f"          Found {total} links across {len(labels)} months")

    print("Step 3/3 — Generating chart …")
    plot_chart(labels, values, output_path)


if __name__ == "__main__":
    main()
