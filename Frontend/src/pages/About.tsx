const About = () => {
  return (
    <div className="page-container">
      <h1>About</h1>

      <section className="about-section">
        <h2>About the System</h2>
        <p>
          The Vacations Management System is a full-stack web application that allows users
          to browse vacation packages, like their favorites, and get AI-powered travel
          recommendations. Administrators can manage vacation listings, view analytics reports,
          and export data.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Browse vacations with filtering (all, liked, active, upcoming)</li>
          <li>Like/unlike vacation packages</li>
          <li>AI-powered travel recommendations</li>
          <li>MCP server for natural language database queries</li>
          <li>Admin panel for vacation CRUD operations</li>
          <li>Analytics reports with charts and CSV export</li>
          <li>User authentication with role-based access control</li>
        </ul>
        <h3>Technology Stack</h3>
        <ul>
          <li><strong>Frontend:</strong> React, TypeScript, Vite, Recharts</li>
          <li><strong>Backend:</strong> Node.js, Express, TypeScript</li>
          <li><strong>Database:</strong> MySQL</li>
          <li><strong>AI:</strong> OpenAI API</li>
          <li><strong>MCP:</strong> Model Context Protocol SDK</li>
          <li><strong>Deployment:</strong> Docker & Docker Compose</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Developer Information</h2>
        <div className="developer-info">
          <p><strong>Name:</strong> Romi</p>
          <p><strong>Project:</strong> Full Stack Web Developer - Project 3</p>
          <p><strong>Course:</strong> John Bryce Training / Matrix Group</p>
          <p><strong>Technologies:</strong> MySQL, MongoDB, Node.js, React, TypeScript</p>
        </div>
      </section>

      <section className="about-section">
        <h2>Demo Accounts</h2>
        <div className="demo-accounts">
          <div className="demo-card">
            <h4>Admin</h4>
            <p>Email: admin@vacations.com</p>
            <p>Password: admin123</p>
          </div>
          <div className="demo-card">
            <h4>User</h4>
            <p>Email: john@example.com</p>
            <p>Password: user123</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
