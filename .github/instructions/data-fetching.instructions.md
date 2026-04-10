---
description: Read this file to understand how to fetch data in this project conventions.
---

# Data Fetching Guidelines

This document outlines the best practices and guidelines for fetching
data in our Next.js application.
Adhering to these guidelines will ensure consistency, performance and maintainability across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS using Server components for data fetching. NEVER use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data.
NEVER fetch data directly in your components or route handlers.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.
