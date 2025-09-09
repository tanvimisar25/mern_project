import React from "react";

class App extends React.Component {
  render() {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        {/* Navbar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 32px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>
            Prepdeck
          </h1>
          <a
            href="#"
            style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}
          >
            Login
          </a>
        </header>

        {/* Welcome Section */}
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "64px",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              padding: "40px 60px",
              textAlign: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              Welcome to Prepdeck
            </h2>
            <p style={{ color: "#4b5563" }}>
              Your ultimate platform for exam preparation.
            </p>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
