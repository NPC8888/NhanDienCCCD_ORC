import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Scan, Database, FileText, LogIn, UserPlus, Menu, X } from "lucide-react";
import { authService } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = authService.getUser()==null ? null : authService.getUser().username;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="logo-icon">📷</span>
          CCCD OCR
        </Link>
      </div>

      {/* nút hamburger */}
      <div className="menu-toggle" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </div>

      <div className={`menu ${open ? "open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)} className={isActive('/') ? 'active' : ''}>
          <Home size={18} /> Home
        </Link>
        <Link to="/scan" onClick={() => setOpen(false)} className={isActive('/scan') ? 'active' : ''}>
          <Scan size={18} /> Quét
        </Link>
        <Link to="/storages" onClick={() => setOpen(false)} className={isActive('/storages') ? 'active' : ''}>
          <Database size={18} /> Kho
        </Link>
        <Link to="/records" onClick={() => setOpen(false)} className={isActive('/records') ? 'active' : ''}>
          <FileText size={18} /> Records
        </Link>

        
      </div>
      {/* mobile auth */}
      <div className="auth mobile-auth">
        {user ? (
          <>
            <span className="username"> {user}</span>
            <Link onClick={()=>authService.logout()} className="register">Log out</Link>
          </>
        ) : (
          <>
            <Link to="/login"><LogIn size={16} /> Login</Link>
            <Link to="/register" className="register"><UserPlus size={16} /> Register</Link>
          </>
        )}
      </div>

      {/* desktop auth */}
      <div className="auth desktop-auth">
        {user ? (
          <>
            <span className="username"> {user}</span>
            <Link onClick={()=>authService.logout()} className="register">Log out</Link>
          </>
        ) : (
          <>
            <Link to="/login"><LogIn size={16} /> Login</Link>
            <Link to="/register" className="register"><UserPlus size={16} /> Register</Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;