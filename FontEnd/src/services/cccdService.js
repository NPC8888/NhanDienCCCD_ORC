const API_BASE_URL = 'http://localhost:8000/api';

export const cccdService = {
  // SCAN ENDPOINTS
  async scanCCCD(frontImageFile, backImageFile, storageId) {
    try {
      const formData = new FormData();
      formData.append('front_image', frontImageFile);
      formData.append('back_image', backImageFile);
      formData.append('storage_id', storageId);

      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/scan/cccd`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // RECORD ENDPOINTS
  async getRecordsInStorage(storageId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/records/storage/${storageId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get records');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getRecordDetail(recordId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Record not found');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async searchRecords(searchParams) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${API_BASE_URL}/records/search?${queryString}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async createRecord(recordData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/records/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(recordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create record');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateRecord(recordId, updateData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update record');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // STORAGE ENDPOINTS
  async getStorages() {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const user = localStorage.getItem('user');
      if (user) {
        headers['X-User-ID'] = JSON.parse(user).id;
      }
      const response = await fetch(`${API_BASE_URL}/storages/user/${JSON.parse(user).id}/`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get storages');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async createStorage(storageData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/storages/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(storageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create storage');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getStorage(storageId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/storages/${storageId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Storage not found');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateStorage(storageId, updateData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/storages/${storageId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update storage');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteStorage(storageId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/storages/${storageId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete storage');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
  
};