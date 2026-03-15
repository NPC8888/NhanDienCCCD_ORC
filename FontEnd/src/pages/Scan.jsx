import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import { Upload, FileImage, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import "./Scan.css";

function Scan() {
  const [selectedFrontFile, setSelectedFrontFile] = useState(null);
  const [selectedBackFile, setSelectedBackFile] = useState(null);
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
      toast.error("Không thể tải danh sách kho");
    }
  };

  const handleFrontFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFrontFile(file);
      setError("");
    }
  };

  const handleBackFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBackFile(file);
      setError("");
    }
  };

  const handleScan = async () => {
    if (!selectedFrontFile || !selectedBackFile) {
      setError("Vui lòng chọn ảnh mặt trước và mặt sau của CCCD");
      toast.error("Vui lòng chọn ảnh mặt trước và mặt sau của CCCD");
      return;
    }
    if (!selectedStorage) {
      setError("Vui lòng chọn kho lưu trữ");
      toast.error("Vui lòng chọn kho lưu trữ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await cccdService.scanCCCD(
        selectedFrontFile,
        selectedBackFile,
        selectedStorage
      );
      setScanResult(result);
      toast.success("Quét CCCD thành công!");
      navigate(`/record/${result.record_id}`);
    } catch (err) {
      setError(err.message || "Quét CCCD thất bại");
      toast.error("Quét CCCD thất bại: " + (err.message || "Lỗi không xác định"));
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
    <div className="scan-page">
      <div className="scan-wrapper">
        <header className="scan-header">
        <div className="scan-header__text">
          <h1>Quét CCCD</h1>
          <p className="scan-subtitle">
            Upload ảnh mặt trước & sau để hệ thống tự động nhận diện và lưu trữ
            thông tin.
          </p>
        </div>
        <div className="scan-header__graphic" aria-hidden="true">
          <div className="graphic-card">
            <div className="graphic-card__layer graphic-card__layer--top" />
            <div className="graphic-card__layer graphic-card__layer--middle" />
            <div className="graphic-card__layer graphic-card__layer--bottom" />
            <div className="graphic-card__icon" aria-hidden="true">🛡️</div>
          </div>
        </div>
      </header>

      <div className="scan-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-label">Chọn kho</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-label">Upload ảnh</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Xem kết quả</div>
        </div>
      </div>

      {!scanResult && (
        <div className="scan-panel">
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
            <label htmlFor="frontImage">Ảnh mặt trước:</label>
            <input
              type="file"
              id="frontImage"
              accept="image/*"
              onChange={handleFrontFileSelect}
              disabled={loading}
            />
            {selectedFrontFile && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(selectedFrontFile)}
                  alt="Front preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="backImage">Ảnh mặt sau:</label>
            <input
              type="file"
              id="backImage"
              accept="image/*"
              onChange={handleBackFileSelect}
              disabled={loading}
            />
            {selectedBackFile && (
              <div className="file-preview">
                <img
                  src={URL.createObjectURL(selectedBackFile)}
                  alt="Back preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={
              loading || !selectedFrontFile || !selectedBackFile || !selectedStorage
            }
            className="scan-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="loading-icon" />
                Đang quét...
              </>
            ) : (
              <>
                <Upload size={18} />
                Quét CCCD
              </>
            )}
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
                setSelectedFrontFile(null);
                setSelectedBackFile(null);
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
    </div>
  );
}

export default Scan;