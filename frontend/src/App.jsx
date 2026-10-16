import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "/api/employees";

const emptyForm = {
  name: "",
  role: "",
  department: "Engineering",
  status: "Active",
  salary: "",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchEmployees() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Employees load nahi ho paaye.");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(
        err.message ||
          "Backend se connection nahi ho raha. Backend server check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = `${employee.name} ${employee.role} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || employee.status === filter;

    return matchesSearch && matchesFilter;
  });

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  }

  function openEditForm(employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      status: employee.status,
      salary: String(employee.salary),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const employeeData = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      status: form.status,
      salary: Number(form.salary),
    };

    if (
      !employeeData.name ||
      !employeeData.role ||
      !employeeData.department ||
      !Number.isFinite(employeeData.salary) ||
      employeeData.salary <= 0
    ) {
      setError("Please enter valid employee details.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Employee save nahi hua.");
      }

      await fetchEmployees();

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(err.message || "Employee save nahi hua.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Employee delete nahi hua.");
      }

      await fetchEmployees();
    } catch (err) {
      setError(err.message || "Employee delete nahi hua.");
    }
  }

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const departments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">E</div>
          <span>
            Employ<span className="brand-light">Ease</span>
          </span>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <button className="nav-item active">
          <span>▦</span> Dashboard
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setFilter("All");
            setMenuOpen(false);
          }}
        >
          <span>♙</span> All Employees
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setFilter("Active");
            setMenuOpen(false);
          }}
        >
          <span>✓</span> Active Employees
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setFilter("On Leave");
            setMenuOpen(false);
          }}
        >
          <span>◷</span> On Leave
        </button>

        <div className="nav-label settings-label">MANAGEMENT</div>

        <button
          className="nav-item"
          onClick={() => {
            setSearch("Engineering");
            setMenuOpen(false);
          }}
        >
          <span>⌘</span> Departments
        </button>

        <button className="nav-item" onClick={openAddForm}>
          <span>＋</span> Add Employee
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Need a hand?</strong>
            <p>Manage your team with ease.</p>
          </div>

          <div className="profile">
            <div className="avatar admin-avatar">TM</div>
            <div className="profile-info">
              <strong>Admin User</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
            <span className="today-label">● Workspace overview</span>
            <button className="icon-button" title="Notifications">
              ♧<i />
            </button>
            <div className="avatar top-avatar">TM</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR TEAM, AT A GLANCE</div>
              <h1>Employee Dashboard</h1>
              <p className="subtitle">
                Manage your people, all in one place.
              </p>
            </div>

            <button className="primary-button" onClick={openAddForm}>
              <span>＋</span> Add Employee
            </button>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: "#b42318",
                background: "#fef3f2",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "18px",
              }}
            >
              {error}
              <button
                type="button"
                onClick={fetchEmployees}
                style={{
                  marginLeft: "12px",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total Employees</span>
                <span className="stat-icon purple">♙</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : employees.length}
              </div>
              <div className="stat-note">
                <span className="trend">↗</span> Team members in total
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Active Employees</span>
                <span className="stat-icon green">✓</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : activeCount}
              </div>
              <div className="stat-note">
                <span className="green-text">●</span> Currently active
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>On Leave</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : leaveCount}
              </div>
              <div className="stat-note">Employees on leave</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Departments</span>
                <span className="stat-icon blue">⌘</span>
              </div>
              <div className="stat-number">
                {loading ? "—" : departments}
              </div>
              <div className="stat-note">Across the organization</div>
            </article>
          </section>

          <section className="employee-section">
            <div className="section-heading">
              <div>
                <h2>All Employees</h2>
                <p>A list of everyone on your team.</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                ↻ Reset
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, role or department..."
                />

                {search && (
                  <button onClick={() => setSearch("")}>×</button>
                )}
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>EMPLOYEE</th>
                    <th>DEPARTMENT</th>
                    <th>STATUS</th>
                    <th>MONTHLY SALARY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Loading employees from database...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="employee-cell">
                            <div
                              className={`avatar employee-avatar color-${employee.id % 5}`}
                            >
                              {employee.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </div>

                            <div className="employee-info">
                              <strong>{employee.name}</strong>
                              <span>{employee.role}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="department-pill">
                            {employee.department}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status ${
                              employee.status === "Active"
                                ? "status-active"
                                : "status-leave"
                            }`}
                          >
                            <i />
                            {employee.status}
                          </span>
                        </td>

                        <td className="salary">
                          ₹
                          {Number(employee.salary).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              title="Edit employee"
                              onClick={() => openEditForm(employee)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              title="Delete employee"
                              onClick={() => deleteEmployee(employee.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!loading && filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No employees found. Try another search or add an
                        employee.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Showing <strong>{filteredEmployees.length}</strong> of{" "}
              <strong>{employees.length}</strong> employees
              <span>Live PostgreSQL database</span>
            </div>
          </section>

          <footer className="footer">
            © 2026 EmployEase <span>Built for better teamwork.</span>
          </footer>
        </section>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => !saving && setShowForm(false)}
        >
          <section
            className="employee-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">TEAM MANAGEMENT</div>
                <h2>
                  {editingId !== null ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p>Enter the employee details below.</p>
              </div>

              <button
                className="close-button"
                disabled={saving}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Full Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Aisha Khan"
                />
              </label>

              <label>
                Job Title
                <input
                  required
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                />
              </label>

              <div className="form-row">
                <label>
                  Department
                  <select
                    value={form.department}
                    onChange={(event) =>
                      setForm({ ...form, department: event.target.value })
                    }
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Human Resources</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>

              <label>
                Monthly Salary (₹)
                <input
                  required
                  type="number"
                  min="1"
                  value={form.salary}
                  onChange={(event) =>
                    setForm({ ...form, salary: event.target.value })
                  }
                  placeholder="e.g. 45000"
                />
              </label>

              {error && (
                <p role="alert" style={{ color: "#b42318" }}>
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={saving}
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;