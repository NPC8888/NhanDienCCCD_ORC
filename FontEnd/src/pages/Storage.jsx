import { useState, useEffect } from "react";
import { cccdService } from "../services/cccdService";
import "./Storage.css";

function Storage() {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStorage, setEditingStorage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    user_id: ""
  });

  useEffect(() => {
    loadStorages();
  }, []);

  const loadStorages = async () => {
    try {
      setLoading(true);
      const data = await cccdService.getStorages();
      setStorages(data);
    } catch (err) {
      setError("Không thể tải danh sách kho");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await cccdService.createStorage(formData);
      setFormData({ name: "", user_id: "" });
      setShowCreateForm(false);
      loadStorages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await cccdService.updateStorage(editingStorage.id, { name: formData.name });
      setEditingStorage(null);
      setFormData({ name: "", user_id: "" });
      loadStorages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (storageId) => {
    if (window.confirm("Bạn có chắc muốn xóa kho này?")) {
      try {
        await cccdService.deleteStorage(storageId);
        loadStorages();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const startEdit = (storage) => {
    setEditingStorage(storage);
    setFormData({ name: storage.name, user_id: storage.user_id });
  };

  const cancelEdit = () => {
    setEditingStorage(null);
    setFormData({ name: "", user_id: "" });
  };

  return (
    <div className="storage-container">
      <div className="storage-header">
        <h1>Quản lý Kho Lưu Trữ</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          {showCreateForm ? "Hủy" : "Tạo kho mới"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreate} className="storage-form">
          <h3>Tạo kho mới</h3>
          <div className="form-group">
            <label>Tên kho:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>User ID:</label>
            <input
              type="number"
              value={formData.user_id}
              onChange={(e) => setFormData({...formData, user_id: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Tạo</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">Hủy</button>
          </div>
        </form>
      )}

      {editingStorage && (
        <form onSubmit={handleUpdate} className="storage-form">
          <h3>Chỉnh sửa kho</h3>
          <div className="form-group">
            <label>Tên kho:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Cập nhật</button>
            <button type="button" onClick={cancelEdit} className="cancel-btn">Hủy</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="storage-list">
          {storages.length === 0 ? (
            <p>Chưa có kho nào</p>
          ) : (
            storages.map((storage) => (
              <div key={storage.id} className="storage-item">
                <div className="storage-info">
                  <h3>{storage.name}</h3>
                  <p>ID: {storage.id} | User ID: {storage.user_id}</p>
                </div>
                <div className="storage-actions">
                  <button onClick={() => startEdit(storage)} className="edit-btn">Sửa</button>
                  <button onClick={() => handleDelete(storage.id)} className="delete-btn">Xóa</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Storage;