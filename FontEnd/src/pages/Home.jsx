import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="Home">
      <div className="home-header">
        <h1>CCCD OCR System</h1>
        {user && (
          <div className="user-info">
            <span>Xin chào, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
          </div>
        )}
      </div>

      <div className="home-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📷 Quét CCCD</h3>
            <p>Upload ảnh CCCD để trích xuất thông tin tự động</p>
            <Link to="/scan" className="feature-link">Bắt đầu quét</Link>
          </div>

          <div className="feature-card">
            <h3>📁 Quản lý Kho</h3>
            <p>Tạo và quản lý các kho lưu trữ CCCD</p>
            <Link to="/storages" className="feature-link">Quản lý kho</Link>
          </div>

          <div className="feature-card">
            <h3>📋 Danh sách Records</h3>
            <p>Xem và quản lý các bản ghi CCCD đã quét</p>
            <Link to="/records" className="feature-link">Xem records</Link>
          </div>

          <div className="feature-card">
            <h3>🔍 Tìm kiếm</h3>
            <p>Tìm kiếm records theo tên hoặc số CCCD</p>
            <Link to="/search" className="feature-link">Tìm kiếm</Link>
          </div>

          <div className="feature-card">
            <h3>➕ Tạo Record Thủ Công</h3>
            <p>Thêm record CCCD mới thủ công</p>
            <Link to="/create-record" className="feature-link">Tạo record</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;