import { useState } from "react";
import { Link } from "react-router-dom";
import { cccdService } from "../services/cccdService";
import "./Search.css";

function Search() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    cccd: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.name.trim() && !searchParams.cccd.trim()) {
      setError("Vui lòng nhập tên hoặc số CCCD để tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await cccdService.searchRecords(searchParams);
      setResults(data);
    } catch (err) {
      setError("Tìm kiếm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Tìm kiếm Records</h1>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="name"
              value={searchParams.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên cần tìm..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="cccd">Số CCCD:</label>
            <input
              type="text"
              id="cccd"
              value={searchParams.cccd}
              onChange={(e) => handleInputChange("cccd", e.target.value)}
              placeholder="Nhập số CCCD..."
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="search-btn">
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="search-results">
          <h2>Kết quả tìm kiếm ({results.length})</h2>
          <div className="results-list">
            {results.map((record) => (
              <div key={record.id} className="result-item">
                <div className="result-info">
                  <h3>{record.name}</h3>
                  <p><strong>Số CCCD:</strong> {record.cccd}</p>
                  <p><strong>Ngày sinh:</strong> {record.dob}</p>
                </div>
                <div className="result-actions">
                  <Link to={`/record/${record.id}`} className="view-btn">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="no-results">
          <p>Nhập thông tin để bắt đầu tìm kiếm</p>
        </div>
      )}
    </div>
  );
}

export default Search;