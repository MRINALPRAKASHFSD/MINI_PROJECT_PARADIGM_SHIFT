import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, IndianRupee } from "lucide-react";
import "./EmployeeProfile.css";

const STORAGE_KEY = "ps_admin_employees_v1";

function loadEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const employee = useMemo(() => {
    const list = loadEmployees();
    return list.find((e) => String(e.employeeId).toUpperCase() === String(employeeId).toUpperCase());
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="emp-profile glass">
        <div className="emp-profile-top">
          <button className="back-btn" onClick={() => navigate("/employees")} type="button">
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div className="emp-profile-empty">
          <h2>Employee not found</h2>
          <p>
            The employee <strong>{employeeId}</strong> does not exist in storage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="emp-profile">
      <div className="emp-profile-top glass">
        <button className="back-btn" onClick={() => navigate("/employees")} type="button">
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        <div className="emp-pill">
          <span className={`status-dot ${employee.status === "Active" ? "active" : "inactive"}`} />
          {employee.status}
        </div>
      </div>

      <div className="emp-hero glass">
        <div className="emp-avatar">{employee.avatar}</div>
        <div className="emp-hero-info">
          <h1>{employee.name}</h1>
          <p className="muted">
            {employee.employeeId} • {employee.department} • {employee.designation}
          </p>
        </div>
      </div>

      <div className="emp-grid">
        <div className="emp-card glass">
          <h3>Contact</h3>
          <div className="kv">
            <Mail size={16} />
            <div>
              <div className="k">Email</div>
              <div className="v">{employee.email}</div>
            </div>
          </div>
          <div className="kv">
            <Phone size={16} />
            <div>
              <div className="k">Phone</div>
              <div className="v">{employee.phone || "-"}</div>
            </div>
          </div>
        </div>

        <div className="emp-card glass">
          <h3>Work</h3>
          <div className="kv">
            <Building2 size={16} />
            <div>
              <div className="k">Department</div>
              <div className="v">{employee.department}</div>
            </div>
          </div>
          <div className="kv">
            <Briefcase size={16} />
            <div>
              <div className="k">Designation</div>
              <div className="v">{employee.designation}</div>
            </div>
          </div>
        </div>

        <div className="emp-card glass">
          <h3>Employment</h3>
          <div className="kv">
            <Calendar size={16} />
            <div>
              <div className="k">Joining Date</div>
              <div className="v">{new Date(employee.joiningDate).toLocaleDateString("en-IN")}</div>
            </div>
          </div>
          <div className="kv">
            <IndianRupee size={16} />
            <div>
              <div className="k">Salary</div>
              <div className="v">₹{Number(employee.salary || 0).toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="emp-next glass">
        <h3>Next: Tabs</h3>
        <p className="muted">
          In Step 2/3 we can add tabs here: Attendance • Leaves • Payroll • Documents.
        </p>
      </div>
    </div>
  );
}