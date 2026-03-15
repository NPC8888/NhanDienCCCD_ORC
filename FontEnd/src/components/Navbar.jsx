import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CCCD OCR</Link>
      </div>

      <div className="menu">
        <Link to="/">Trang chủ</Link>
        {isAuthenticated && (
          <>
            <Link to="/scan">Quét CCCD</Link>
            <Link to="/records">Records</Link>
            <Link to="/search">Tìm kiếm</Link>
            <Link to="/storages">Kho lưu trữ</Link>
            <Link to="/create-record">Tạo record</Link>
          </>
        )}
        <Link to="/about">Giới thiệu</Link>
      </div>

      <div className="auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <span>Xin chào, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
          </div>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link className="register" to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;