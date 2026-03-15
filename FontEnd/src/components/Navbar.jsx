// tạo navbar đơn giản với react-router-dom

import { Link, useLocation } from "react-router-dom";
import { Home, Scan, Database, FileText, LogIn, UserPlus } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="logo-icon">📷</span>
          CCCD OCR
        </Link>
      </div>

      <div className="menu">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          <Home size={18} />
          Home
        </Link>
        <Link to="/scan" className={isActive('/scan') ? 'active' : ''}>
          <Scan size={18} />
          Quét
        </Link>
        <Link to="/storages" className={isActive('/storages') ? 'active' : ''}>
          <Database size={18} />
          Kho
        </Link>
        <Link to="/records" className={isActive('/records') ? 'active' : ''}>
          <FileText size={18} />
          Records
        </Link>
      </div>

      <div className="auth">
        <Link to="/login" className={isActive('/login') ? 'active' : ''}>
          <LogIn size={16} />
          Login
        </Link>
        <Link className={`register ${isActive('/register') ? 'active' : ''}`} to="/register">
          <UserPlus size={16} />
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;