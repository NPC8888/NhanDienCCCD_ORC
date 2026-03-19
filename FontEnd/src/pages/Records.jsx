import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import { Search, Filter, Eye, Database } from "lucide-react";
import toast from "react-hot-toast";
import "./Records.css";

function Records() {
  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadStorages();
  }, []);

  useEffect(() => {
    filterAndSortRecords();
  }, [records, searchTerm, sortBy]);

  const loadStorages = async () => {
    try {
      const data = await cccdService.getStorages();
      setStorages(data);
    } catch (err) {
      console.error("Failed to load storages:", err);
      toast.error("Không thể tải danh sách kho");
    }
  };

  const loadRecords = async (storageId) => {
    try {
      setLoading(true);
      setError("");
      console.log("Loading records for storage:", storageId);
      const data = await cccdService.getRecordsInStorage(storageId);
      console.log("Loaded records:", data);
      setRecords(Array.isArray(data) ? data : []);
      toast.success(`Đã tải ${Array.isArray(data) ? data.length : 0} records`);
    } catch (err) {
      console.error("Error loading records:", err);
      setError("Không thể tải danh sách records");
      setRecords([]);
      toast.error("Không thể tải danh sách records");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecords = () => {
    try {
      let filtered = [...records];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(record =>
          record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.id_number && record.id_number.includes(searchTerm)
        );
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "cccd":
            return (a.cccd_number || "").localeCompare(b.cccd_number || "");
          case "date":
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
            return dateB - dateA;
          default:
            return 0;
        }
      });

      setFilteredRecords(filtered);
    } catch (err) {
      console.error("Error filtering records:", err);
      setFilteredRecords(records);
    }
  };

  const handleStorageChange = (e) => {
    const storageId = e.target.value;
    setSelectedStorage(storageId);
    setSearchTerm("");
    setError("");
    if (storageId) {
      loadRecords(storageId);
    } else {
      setRecords([]);
      setFilteredRecords([]);
    }
  };

  return (
    <div className="records-page">
      <div className="records-container">
        <div className="records-header">
          <h1>Danh sách Records</h1>
          <p className="records-subtitle">
            Xem và quản lý tất cả các bản ghi CCCD trong kho lưu trữ của bạn
          </p>
        </div>

        <div className="records-controls">
          <div className="storage-selector">
            <div className="selector-icon">
              <Database size={20} />
            </div>
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

          {selectedStorage && (
            <div className="search-filter-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc số CCCD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="sort-selector">
                <Filter size={20} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="cccd">Sắp xếp theo CCCD</option>
                  <option value="date">Sắp xếp theo ngày</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải records...</p>
          </div>
        ) : (
          <div className="records-results">
            {selectedStorage && (
              <div className="results-header">
                <p>Hiển thị {filteredRecords.length} / {records.length} records</p>
              </div>
            )}

            <div className="records-list">
              {filteredRecords.length === 0 ? (
                <div className="empty-state">
                  {selectedStorage ? (
                    searchTerm ? (
                      <>
                        <Search size={48} />
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Không có records nào khớp với "{searchTerm}"</p>
                      </>
                    ) : (
                      <>
                        <Database size={48} />
                        <h3>Kho trống</h3>
                        <p>Kho này chưa có records nào</p>
                      </>
                    )
                  ) : (
                    <>
                      <Database size={48} />
                      <h3>Chọn kho để xem records</h3>
                      <p>Vui lòng chọn một kho từ danh sách bên trên</p>
                    </>
                  )}
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id || Math.random()} className="record-item">
                    <div className="record-info">
                      <h3>{record.name || "N/A"}</h3>
                      <p><strong>Số CCCD:</strong> {record.id_number || "N/A"}</p>
                      <p><strong>Ngày sinh:</strong> {record.dob || "N/A"}</p>
                      <p><strong>Giới tính:</strong> {record.gender || "N/A"}</p>
                    </div>
                    <div className="record-actions">
                      <Link to={`/record/${record.id}`} className="view-btn">
                        <Eye size={16} />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;