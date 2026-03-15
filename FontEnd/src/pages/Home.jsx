import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { Camera, Database, FileText, BarChart3, Shield, Zap } from "lucide-react";
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
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-text">
          <h1>CCCD OCR System</h1>
          <p>
            Hệ thống quét và trích xuất dữ liệu CCCD bằng công nghệ OCR & YOLO.
          </p>
          <div className="hero-actions">
            <Link to="/scan" className="hero-btn">
              Bắt đầu quét
            </Link>
            <Link to="/records" className="hero-link">
              Xem records
            </Link>
          </div>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <div className="hero-blob" />
          <div className="hero-blob hero-blob--secondary" />
          <div className="hero-illustration">
            <Camera size={60} className="hero-icon" />
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Camera size={32} />
            </div>
            <h3>Quét CCCD</h3>
            <p>Upload ảnh CCCD để trích xuất thông tin tự động với công nghệ OCR & YOLO</p>
            <Link to="/scan" className="feature-link">Bắt đầu quét</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Database size={32} />
            </div>
            <h3>Quản lý Kho</h3>
            <p>Tạo và quản lý các kho lưu trữ CCCD một cách có tổ chức</p>
            <Link to="/storages" className="feature-link">Quản lý kho</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={32} />
            </div>
            <h3>Danh sách Records</h3>
            <p>Xem và quản lý các bản ghi CCCD đã quét với giao diện thân thiện</p>
            <Link to="/records" className="feature-link">Xem records</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={32} />
            </div>
            <h3>Thống kê</h3>
            <p>Xem báo cáo và thống kê về hoạt động quét CCCD</p>
            <Link to="/search" className="feature-link">Xem thống kê</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Bảo mật</h3>
            <p>Dữ liệu được bảo mật với hệ thống xác thực mạnh mẽ</p>
            <Link to="/login" className="feature-link">Đăng nhập</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Nhanh chóng</h3>
            <p>Xử lý OCR chỉ trong vài giây với công nghệ tiên tiến</p>
            <Link to="/create-record" className="feature-link">Tạo record</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;