import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import "./CreateRecord.css";

function CreateRecord() {
  const [storages, setStorages] = useState([]);
  const [formData, setFormData] = useState({
    storage_id: "",
    id_number: "",
    name: "",
    gender: "",
    dob: "",
    nationality: "",
    origin_place: "",
    current_place: "",
    issue_date: "",
    expire_date: "",
    features: "",
    qr_text: "",
    fingerprint_detected: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadStorages();
  }, []);

  const loadStorages = async () => {
    try {
      const data = await cccdService.getStorages();
      setStorages(data);
    } catch (err) {
      console.error("Failed to load storages:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.storage_id || !formData.id_number || !formData.name) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await cccdService.createRecord(formData);
      navigate(`/record/${result.record_id}`);
    } catch (err) {
      setError(err.message || "Tạo record thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-record-container">
      <h1>Tạo Record CCCD Thủ Công</h1>

      <form onSubmit={handleSubmit} className="create-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <h2>Thông tin bắt buộc</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="storage_id">Kho lưu trữ *</label>
              <select
                id="storage_id"
                value={formData.storage_id}
                onChange={(e) => handleInputChange("storage_id", e.target.value)}
                required
              >
                <option value="">-- Chọn kho --</option>
                {storages.map((storage) => (
                  <option key={storage.id} value={storage.id}>
                    {storage.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="id_number">Số CCCD *</label>
              <input
                type="text"
                id="id_number"
                value={formData.id_number}
                onChange={(e) => handleInputChange("id_number", e.target.value)}
                required
                maxLength="12"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Họ tên *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="NAM">NAM</option>
                <option value="NU">NU</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Thông tin bổ sung</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dob">Ngày sinh</label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nationality">Quốc tịch</label>
              <input
                type="text"
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="origin_place">Nguyên quán</label>
              <input
                type="text"
                id="origin_place"
                value={formData.origin_place}
                onChange={(e) => handleInputChange("origin_place", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="current_place">Nơi thường trú</label>
              <input
                type="text"
                id="current_place"
                value={formData.current_place}
                onChange={(e) => handleInputChange("current_place", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="issue_date">Ngày cấp</label>
              <input
                type="date"
                id="issue_date"
                value={formData.issue_date}
                onChange={(e) => handleInputChange("issue_date", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expire_date">Ngày hết hạn</label>
              <input
                type="date"
                id="expire_date"
                value={formData.expire_date}
                onChange={(e) => handleInputChange("expire_date", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Thông tin khác</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="features">Đặc điểm nhận dạng</label>
              <textarea
                id="features"
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="qr_text">Dữ liệu QR</label>
              <input
                type="text"
                id="qr_text"
                value={formData.qr_text}
                onChange={(e) => handleInputChange("qr_text", e.target.value)}
              />
            </div>

            <div className="form-group">
              
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Đang tạo..." : "Tạo Record"}
          </button>
          <button type="button" onClick={() => navigate("/")} className="cancel-btn">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRecord;