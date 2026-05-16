import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Layout, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Check
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge animate-fade-in">
          v2.0 is now available with Team Workspaces
        </div>
        <h1 className="hero-title animate-fade-in">
          Manage your team's tasks with <span style={{ color: '#4f46e5' }}>elegant</span> precision.
        </h1>
        <p className="hero-subtitle animate-fade-in">
          The all-in-one workspace for modern teams to collaborate, track progress, and hit every deadline with style.
        </p>
        <div className="hero-cta animate-fade-in">
          <Link to="/register" className="btn-lg btn-primary-gradient">
            Get Started Free <ArrowRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </Link>
          <Link to="/login" className="btn-lg btn-outline" style={{ border: '2px solid #e2e8f0' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Powerful Features</span>
          <h2 className="section-title">Everything you need to scale</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Layout size={32} /></div>
            <h3>Intuitive Kanban</h3>
            <p>Visualize your workflow with our classy drag-and-drop board. Stay organized without the clutter.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Real-time Stats</h3>
            <p>Get instant insights into your team's performance with our rich dashboard analytics.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Users size={32} /></div>
            <h3>Team Collaboration</h3>
            <p>Seamlessly assign tasks and manage project members in a single, beautiful workspace.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Shield size={32} /></div>
            <h3>Secure by Design</h3>
            <p>Enterprise-grade security ensuring your data is protected with industry-standard encryption.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={32} /></div>
            <h3>Project Scoping</h3>
            <p>Filter and view tasks based on your role, ensuring everyone sees exactly what they need.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><CheckCircle size={32} /></div>
            <h3>Deadline Tracking</h3>
            <p>Never miss a beat with our automated overdue task alerts and visual status indicators.</p>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>TaskMaster</h2>
            <p>Building the future of team collaboration, one task at a time.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>Integrations</li>
              <li>Security</li>
              <li>Enterprise</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Community</li>
              <li>API Docs</li>
              <li>Status</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 TaskMaster. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Twitter</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
