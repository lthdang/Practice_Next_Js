import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Customer() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Customer Dashboard</title>
      </Head>
      <div style={{ padding: "20px" }}>
        <h1>Customer Dashboard</h1>
        <div style={{ marginBottom: "20px" }}>
          <p>Welcome, {user.full_name || user.username}!</p>
          <p>Role: {user.role.role_name}</p>
          <p>Email: {user.email}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h2>Available Features</h2>
          <ul>
            <li>Browse Courses</li>
            <li>My Enrollments</li>
            <li>Progress Tracking</li>
            <li>Profile Settings</li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8f2c24",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
