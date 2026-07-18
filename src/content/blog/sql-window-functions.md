---
title: 'A Field Guide to SQL Window Functions'
description: 'The single most underused feature in SQL: aggregate context without collapsing your rows.'
pubDate: 2026-06-21
---

`GROUP BY` has one big limitation: it collapses rows. If you want each order *and* the customer's running total, or each employee *and* their department's average, plain aggregation forces you into subqueries and self-joins.

Window functions remove the limitation. They compute aggregates **over a window of related rows while keeping every row in the output**.

## The shape of a window function

Every window function has the same anatomy:

```sql
SELECT
	employee,
	department,
	salary,
	AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;
```

Reading it aloud: *for each row, compute the average salary over all rows in the same department*. No rows disappear — every employee keeps their own line, now annotated with context.

The `OVER` clause is what makes it a window function, and it has three optional parts:

| Clause | What it controls |
| ------ | ---------------- |
| `PARTITION BY` | Which rows belong to the same group |
| `ORDER BY` | The ordering *within* each partition |
| Frame (`ROWS BETWEEN …`) | Which slice of the partition is visible |

## Ranking: the gateway drug

The most common first use is ranking rows within a group — say, the top earner per department:

```sql
SELECT *
FROM (
	SELECT
		employee,
		department,
		salary,
		ROW_NUMBER() OVER (
			PARTITION BY department
			ORDER BY salary DESC
		) AS rank_in_dept
	FROM employees
) ranked
WHERE rank_in_dept <= 3;
```

Three ranking functions look similar but tie-break differently:

- `ROW_NUMBER()` — always unique: 1, 2, 3, 4. Ties broken arbitrarily.
- `RANK()` — ties share a rank and create gaps: 1, 2, 2, 4.
- `DENSE_RANK()` — ties share a rank without gaps: 1, 2, 2, 3.

## Running totals and moving averages

Add `ORDER BY` inside `OVER` and aggregates become *cumulative*:

```sql
SELECT
	order_date,
	amount,
	SUM(amount) OVER (ORDER BY order_date) AS running_total,
	AVG(amount) OVER (
		ORDER BY order_date
		ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
	) AS week_moving_avg
FROM orders;
```

The frame clause (`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`) is the part people skip in tutorials, and it's where the real power lives — it defines exactly which neighbors each row can see.

> If you've ever exported data to a spreadsheet just to compute a running total, window functions are the feature you were missing.

## When to reach for them

Any time you catch yourself writing a self-join or a correlated subquery to answer "…compared to its group", pause — it's almost certainly a window function. They're standard SQL, supported by Postgres, MySQL 8+, SQLite, DuckDB, BigQuery, and everything else you're likely to touch.
