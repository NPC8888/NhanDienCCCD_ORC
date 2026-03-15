import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import "./Records.css";

function Records() {
  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const loadRecords = async (storageId) => {
    try {
      setLoading(true);
      const data = await cccdService.getRecordsInStorage(storageId);
      setRecords(data);
    } catch (err) {
      setError("Không thể tải danh sách records");
    } finally {
      setLoading(false);
    }
  };

  const handleStorageChange = (e) => {
    const storageId = e.target.value;
    setSelectedStorage(storageId);
    if (storageId) {
      loadRecords(storageId);
    } else {
      setRecords([]);
    }
  };

  return (
    <div className="records-container">
      <h1>Danh sách Records</h1>

      <div className="storage-selector">
        <label htmlFor="storage-select">Chọn kho:</label>
        <select
          id="storage-select"
          value={selectedStorage}
          onChange={handleStorageChange}
        >
          <option value="">-- Chọn kho --</option>
          {storages.map((storage) => (
            <option key={storage.id} value={storage.id}>
              {storage.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="records-list">
          {records.length === 0 ? (
            <p>Chưa có records nào</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="record-item">
                <div className="record-info">
                  <h3>{record.name}</h3>
                  <p><strong>Số CCCD:</strong> {record.cccd_number}</p>
                  <p><strong>Ngày sinh:</strong> {record.dob}</p>
                  <p><strong>Giới tính:</strong> {record.gender}</p>
                </div>
                <div className="record-actions">
                  <Link to={`/record/${record.id}`} className="view-btn">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Records;