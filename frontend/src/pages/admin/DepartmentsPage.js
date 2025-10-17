import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DepartmentsPage = ({ user, onLogout }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data.data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editMode && currentDept) {
        await axios.put(`${API}/departments/${currentDept._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Department updated successfully');
      } else {
        await axios.post(`${API}/departments`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Department created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', code: '' });
      setEditMode(false);
      setCurrentDept(null);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (dept) => {
    setCurrentDept(dept);
    setFormData({ name: dept.name, code: dept.code });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Departments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage all departments</p>
          <button
            onClick={() => {
              setShowModal(true);
              setEditMode(false);
              setFormData({ name: '', code: '' });
            }}
            className="btn-primary flex items-center gap-2"
            data-testid="add-department-button"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="departments-grid">
            {departments.map((dept) => (
              <div key={dept._id} className="card" data-testid={`department-card-${dept.code}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                      {dept.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Code: {dept.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                      data-testid={`edit-dept-${dept.code}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                      data-testid={`delete-dept-${dept.code}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Sections: {dept.sections?.length || 0}</p>
                  <p>HOD: {dept.hodId?.name || 'Not Assigned'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="department-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              {editMode ? 'Edit Department' : 'Add Department'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  data-testid="dept-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                  placeholder="e.g., Computer Science Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Code</label>
                <input
                  type="text"
                  data-testid="dept-code-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="input-field"
                  required
                  placeholder="e.g., CSE"
                  disabled={editMode}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', code: '' });
                    setEditMode(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary" data-testid="submit-dept-button">
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DepartmentsPage;