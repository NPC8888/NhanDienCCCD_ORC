import { useState, useEffect } from "react";
import { cccdService } from "../services/cccdService";
import { Database, Plus, Edit, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
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
      toast.error("Không thể tải danh sách kho");
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
      toast.success("Tạo kho thành công!");
    } catch (err) {
      setError(err.message);
      toast.error("Không thể tạo kho: " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await cccdService.updateStorage(editingStorage.id, { name: formData.name });
      setEditingStorage(null);
      setFormData({ name: "", user_id: "" });
      loadStorages();
      toast.success("Cập nhật kho thành công!");
    } catch (err) {
      setError(err.message);
      toast.error("Không thể cập nhật kho: " + err.message);
    }
  };

  const handleDelete = async (storageId) => {
    if (window.confirm("Bạn có chắc muốn xóa kho này?")) {
      try {
        await cccdService.deleteStorage(storageId);
        loadStorages();
        toast.success("Xóa kho thành công!");
      } catch (err) {
        setError(err.message);
        toast.error("Không thể xóa kho: " + err.message);
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
    <div className="storage-page">
      <div className="storage-container">
        <div className="storage-header">
          <div className="storage-header__text">
            <h1>Quản lý Kho Lưu Trữ</h1>
            <p className="storage-subtitle">
              Tạo và quản lý các kho lưu trữ để tổ chức dữ liệu CCCD của bạn
            </p>
          </div>
          <div className="storage-header__actions">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="create-btn"
            >
              <Plus size={16} />
              {showCreateForm ? "Hủy" : "Tạo kho mới"}
            </button>
          </div>
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
              <button type="submit" className="submit-btn">
                <Check size={16} />
                Tạo
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                <X size={16} />
                Hủy
              </button>
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
              <button type="submit" className="submit-btn">
                <Check size={16} />
                Cập nhật
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                <X size={16} />
                Hủy
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách kho...</p>
          </div>
        ) : (
          <div className="storage-list">
            {storages.length === 0 ? (
              <p>Chưa có kho nào</p>
            ) : (
              storages.map((storage) => (
                <div key={storage.id} className="storage-item">
                  <div className="storage-info">
                    <h3>{storage.name}</h3>
                    <p><strong>ID:</strong> {storage.id}</p>
                    <p><strong>User ID:</strong> {storage.user_id}</p>
                  </div>
                  <div className="storage-actions">
                  <button onClick={() => startEdit(storage)} className="edit-btn">
                    <Edit size={16} />
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(storage.id)} className="delete-btn">
                    <Trash2 size={16} />
                    Xóa
                  </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Storage;