const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check API and database connection
app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      message: "Employee Management API is running!",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch employees error:", error.message);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get one employee
app.get("/api/employees/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employees WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Fetch employee error:", error.message);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// Add employee
app.post("/api/employees", async (req, res) => {
  const { name, role, department, status, salary } = req.body;

  if (
    !name?.trim() ||
    !role?.trim() ||
    !department?.trim() ||
    !Number.isFinite(Number(salary)) ||
    Number(salary) <= 0
  ) {
    return res.status(400).json({
      error: "Name, role, department and a positive salary are required",
    });
  }

  const validStatus = ["Active", "On Leave"].includes(status)
    ? status
    : "Active";

  try {
    const result = await pool.query(
      `INSERT INTO employees (name, role, department, status, salary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        role.trim(),
        department.trim(),
        validStatus,
        Number(salary),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add employee error:", error.message);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Update employee
app.put("/api/employees/:id", async (req, res) => {
  const { name, role, department, status, salary } = req.body;

  if (
    !name?.trim() ||
    !role?.trim() ||
    !department?.trim() ||
    !Number.isFinite(Number(salary)) ||
    Number(salary) <= 0
  ) {
    return res.status(400).json({
      error: "Name, role, department and a positive salary are required",
    });
  }

  const validStatus = ["Active", "On Leave"].includes(status)
    ? status
    : "Active";

  try {
    const result = await pool.query(
      `UPDATE employees
       SET name = $1,
           role = $2,
           department = $3,
           status = $4,
           salary = $5
       WHERE id = $6
       RETURNING *`,
      [
        name.trim(),
        role.trim(),
        department.trim(),
        validStatus,
        Number(salary),
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update employee error:", error.message);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete employee error:", error.message);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);