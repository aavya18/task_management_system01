import React, { useContext } from 'react';
import { LogOut, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Can put a search bar or breadcrumbs here */}
      </div>
      
      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn logout-btn" onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
