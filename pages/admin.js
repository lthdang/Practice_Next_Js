import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RoleEnum } from "../utils/enum/role_emun";

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role_id !== 1) {
      router.push("/customer");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "users", name: "Manage Users", icon: "👥" },
    { id: "courses", name: "Manage Courses", icon: "📚" },
    { id: "analytics", name: "Analytics", icon: "📈" },
    { id: "settings", name: "Settings", icon: "⚙️" },
  ];

  const dashboardCards = [
    { title: "Total Users", value: "1,234", change: "+12%", color: "#4CAF50" },
    { title: "Total Courses", value: "89", change: "+5%", color: "#2196F3" },
    {
      title: "Active Enrollments",
      value: "456",
      change: "+8%",
      color: "#FF9800",
    },
    { title: "Revenue", value: "$12,345", change: "+15%", color: "#9C27B0" },
  ];
  return (
    <>
      <Head>
        <title>Admin Dashboard - Language Learning Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="admin-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              {sidebarOpen && <span className="logo-text">EduAdmin</span>}
            </div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.id)}
                title={!sidebarOpen ? item.name : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-text">{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {(user.full_name || user.username).charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="user-details">
                  <div className="user-name">
                    {user.full_name || user.username}
                  </div>
                  <div className="user-role">
                    {RoleEnum[user.role.role_name]}
                  </div>
                </div>
              )}
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title={!sidebarOpen ? "Logout" : ""}
            >
              🚪 {sidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="top-bar">
            <div className="page-title">
              <h1>
                {menuItems.find((item) => item.id === activeSection)?.name ||
                  "Dashboard"}
              </h1>
              <p>Welcome back, {user.full_name || user.username}!</p>
            </div>
            <div className="top-bar-actions">
              <button className="notification-btn">🔔</button>
              <div className="user-menu">
                <img
                  src={user.avatar_url || "/default-avatar.png"}
                  alt="User"
                  className="user-avatar-small"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </div>
            </div>
          </header>
          {/* Dashboard Content */}
          <div className="content-area">
            {activeSection === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="stats-grid">
                  {dashboardCards.map((card, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-header">
                        <h3>{card.title}</h3>
                        <span className="stat-change positive">
                          {card.change}
                        </span>
                      </div>
                      <div className="stat-value" style={{ color: card.color }}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                  <div className="chart-card">
                    <h3>User Growth</h3>
                    <div className="chart-placeholder">
                      📊 Chart placeholder - User growth over time
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Course Enrollments</h3>
                    <div className="chart-placeholder">
                      📈 Chart placeholder - Course enrollment trends
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">👤</span>
                      <span>New user registered: john.doe@example.com</span>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">📚</span>
                      <span>New course created: Advanced JavaScript</span>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">💰</span>
                      <span>Payment received: $99.99</span>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "users" && (
              <div className="management-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <button className="btn-primary">+ Add New User</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                        <td>
                          <span className="badge student">Student</span>
                        </td>
                        <td>
                          <span className="status active">Active</span>
                        </td>
                        <td>
                          <button className="btn-sm">Edit</button>
                          <button className="btn-sm danger">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "courses" && (
              <div className="management-section">
                <div className="section-header">
                  <h2>Course Management</h2>
                  <button className="btn-primary">+ Create Course</button>
                </div>
                <div className="course-grid">
                  <div className="course-card">
                    <div className="course-thumbnail">📚</div>
                    <h4>JavaScript Fundamentals</h4>
                    <p>89 enrolled students</p>
                    <div className="course-actions">
                      <button className="btn-sm">Edit</button>
                      <button className="btn-sm">View</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections placeholder */}
            {["analytics", "settings"].includes(activeSection) && (
              <div className="placeholder-section">
                <h2>
                  {menuItems.find((item) => item.id === activeSection)?.name}
                </h2>
                <p>This section is under development...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f5f5;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .sidebar.closed {
          width: 80px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: bold;
          font-size: 1.2em;
          overflow: hidden;
        }

        .logo-icon {
          font-size: 2em;
          min-width: 40px;
        }

        .logo-text {
          white-space: nowrap;
          transition: opacity 0.3s ease;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          width: 100%;
          padding: 15px 20px;
          background: none;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.2);
          border-right: 4px solid white;
        }

        .nav-icon {
          font-size: 1.2em;
          width: 24px;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9em;
        }

        .user-role {
          font-size: 0.8em;
          opacity: 0.8;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          background: white;
          padding: 20px 30px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .page-title h1 {
          margin: 0;
          color: #333;
          font-size: 1.8em;
        }

        .page-title p {
          margin: 5px 0 0 0;
          color: #666;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notification-btn {
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .notification-btn:hover {
          background: #f5f5f5;
        }

        .content-area {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .stat-header h3 {
          margin: 0;
          color: #666;
          font-size: 0.9em;
          font-weight: 500;
        }

        .stat-change {
          font-size: 0.8em;
          padding: 4px 8px;
          border-radius: 12px;
          background: #e8f5e8;
          color: #4caf50;
        }

        .stat-value {
          font-size: 2.2em;
          font-weight: bold;
          margin: 0;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .chart-card h3 {
          margin-top: 0;
          color: #333;
        }

        .chart-placeholder {
          height: 200px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .activity-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .activity-section h3 {
          margin-top: 0;
          color: #333;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-time {
          margin-left: auto;
          color: #999;
          font-size: 0.9em;
        }

        .management-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .data-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 500;
        }

        .badge.student {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status.active {
          color: #4caf50;
        }

        .btn-sm {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 8px;
          font-size: 0.9em;
        }

        .btn-sm:hover {
          background: #f5f5f5;
        }

        .btn-sm.danger {
          color: #f44336;
          border-color: #f44336;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .course-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .course-thumbnail {
          font-size: 3em;
          margin-bottom: 15px;
        }

        .course-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
        }

        .placeholder-section {
          background: white;
          padding: 50px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2em;
          color: #666;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            position: fixed;
            z-index: 1000;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
