import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import "./Scan.css";

function Scan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(null);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn ảnh CCCD");
      return;
    }
    if (!selectedStorage) {
      setError("Vui lòng chọn kho lưu trữ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await cccdService.scanCCCD(selectedFile, selectedStorage);
      setScanResult(result);
    } catch (err) {
      setError(err.message || "Quét CCCD thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = () => {
    if (scanResult?.record_id) {
      navigate(`/record/${scanResult.record_id}`);
    }
  };

  return (
    <div className="scan-container">
      <h1>Quét CCCD</h1>

      {!scanResult && (
        <div className="scan-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="storage">Chọn kho lưu trữ:</label>
            <select
              id="storage"
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              disabled={loading}
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
            <label htmlFor="image">Chọn ảnh CCCD:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={loading}
            />
            {selectedFile && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !selectedFile || !selectedStorage}
            className="scan-btn"
          >
            {loading ? "Đang quét..." : "Quét CCCD"}
          </button>
        </div>
      )}

      {scanResult && (
        <div className="scan-result">
          <div className="success-message">
            <h2>✅ Quét thành công!</h2>
            <p>Record ID: {scanResult.record_id}</p>
          </div>

          <div className="extracted-fields">
            <h3>Thông tin trích xuất:</h3>
            <div className="fields-grid">
              {Object.entries(scanResult.fields).map(([field, data]) => (
                <div key={field} className="field-item">
                  <strong>{field.toUpperCase()}:</strong>
                  <span>{data.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="result-actions">
            <button onClick={handleViewRecord} className="view-btn">
              Xem chi tiết record
            </button>
            <button
              onClick={() => {
                setScanResult(null);
                setSelectedFile(null);
                setSelectedStorage("");
              }}
              className="scan-again-btn"
            >
              Quét lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scan;