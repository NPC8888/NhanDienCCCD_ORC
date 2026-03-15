import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import "./RecordDetail.css";

function RecordDetail() {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [images, setImages] = useState([]);
  const [rawFields, setRawFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadRecordDetail();
  }, [recordId]);

  const loadRecordDetail = async () => {
    try {
      setLoading(true);
      const data = await cccdService.getRecordDetail(recordId);
      setRecord(data.record);
      setImages(data.images);
      setRawFields(data.raw_fields);
      setEditData(data.record);
    } catch (err) {
      setError("Không thể tải chi tiết record");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await cccdService.updateRecord(recordId, editData);
      setRecord(editData);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!record) {
    return <div className="error-message">Record không tồn tại</div>;
  }

  return (
    <div className="record-detail-container">
      <div className="detail-header">
        <h1>Chi tiết Record #{record.id}</h1>
        <div className="header-actions">
          <button onClick={() => setEditing(!editing)} className="edit-btn">
            {editing ? "Hủy" : "Chỉnh sửa"}
          </button>
          <button onClick={() => navigate("/records")} className="back-btn">
            Quay lại
          </button>
        </div>
      </div>

      <div className="record-content">
        <div className="main-info">
          <h2>Thông tin chính</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Số CCCD:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.id_number || ""}
                  onChange={(e) => handleInputChange("id_number", e.target.value)}
                />
              ) : (
                <span>{record.cccd_number}</span>
              )}
            </div>

            <div className="info-item">
              <label>Họ tên:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              ) : (
                <span>{record.name}</span>
              )}
            </div>

            <div className="info-item">
              <label>Giới tính:</label>
              {editing ? (
                <select
                  value={editData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="NAM">NAM</option>
                  <option value="NU">NU</option>
                </select>
              ) : (
                <span>{record.gender}</span>
              )}
            </div>

            <div className="info-item">
              <label>Ngày sinh:</label>
              {editing ? (
                <input
                  type="date"
                  value={editData.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              ) : (
                <span>{record.dob}</span>
              )}
            </div>

            <div className="info-item">
              <label>Quốc tịch:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.nationality || ""}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                />
              ) : (
                <span>{record.nationality}</span>
              )}
            </div>

            <div className="info-item">
              <label>Nguyên quán:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.origin_place || ""}
                  onChange={(e) => handleInputChange("origin_place", e.target.value)}
                />
              ) : (
                <span>{record.origin_place}</span>
              )}
            </div>

            <div className="info-item">
              <label>Nơi thường trú:</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.current_place || ""}
                  onChange={(e) => handleInputChange("current_place", e.target.value)}
                />
              ) : (
                <span>{record.current_place}</span>
              )}
            </div>

            <div className="info-item">
              <label>Ngày cấp:</label>
              {editing ? (
                <input
                  type="date"
                  value={editData.issue_date || ""}
                  onChange={(e) => handleInputChange("issue_date", e.target.value)}
                />
              ) : (
                <span>{record.issue_date}</span>
              )}
            </div>

            <div className="info-item">
              <label>Ngày hết hạn:</label>
              {editing ? (
                <input
                  type="date"
                  value={editData.expire_date || ""}
                  onChange={(e) => handleInputChange("expire_date", e.target.value)}
                />
              ) : (
                <span>{record.expire_date}</span>
              )}
            </div>

            <div className="info-item full-width">
              <label>Đặc điểm nhận dạng:</label>
              {editing ? (
                <textarea
                  value={editData.features || ""}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  rows="3"
                />
              ) : (
                <span>{record.features}</span>
              )}
            </div>
          </div>

          {editing && (
            <div className="edit-actions">
              <button onClick={handleUpdate} className="save-btn">Lưu</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Hủy</button>
            </div>
          )}
        </div>

        {record.image_path && (
          <div className="original-image">
            <h2>Ảnh gốc</h2>
            <img src={`http://localhost:8000/${record.image_path}`} alt="Original CCCD" />
          </div>
        )}

        {images.length > 0 && (
          <div className="crop-images">
            <h2>Ảnh crop các trường</h2>
            <div className="images-grid">
              {images.map((img, index) => (
                <div key={index} className="image-item">
                  <h4>{img.field.toUpperCase()}</h4>
                  <img src={`http://localhost:8000/${img.image_path}`} alt={img.field} />
                </div>
              ))}
            </div>
          </div>
        )}

        {rawFields.length > 0 && (
          <div className="raw-fields">
            <h2>Dữ liệu OCR thô</h2>
            <div className="raw-grid">
              {rawFields.map((field, index) => (
                <div key={index} className="raw-item">
                  <strong>{field.field.toUpperCase()}:</strong>
                  <span>{field.raw_text}</span>
                  <small>Confidence: {field.confidence}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordDetail;