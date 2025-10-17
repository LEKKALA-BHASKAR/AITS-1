import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SectionsPage = ({ user, onLogout }) => {
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState({ name: '', departmentId: '', teacherId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [sectionsRes, deptsRes, teachersRes] = await Promise.all([
        axios.get(`${API}/sections`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/departments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/teachers`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSections(sectionsRes.data.data);
      setDepartments(deptsRes.data.data);
      setTeachers(teachersRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editMode && currentSection) {
        await axios.put(`${API}/sections/${currentSection._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Section updated successfully');
      } else {
        await axios.post(`${API}/sections`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Section created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', departmentId: '', teacherId: '' });
      setEditMode(false);
      setCurrentSection(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setFormData({
      name: section.name,
      departmentId: section.departmentId?._id || '',
      teacherId: section.teacherId?._id || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Section deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Sections">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage all sections</p>
          <button
            onClick={() => {
              setShowModal(true);
              setEditMode(false);
              setFormData({ name: '', departmentId: '', teacherId: '' });
            }}
            className="btn-primary flex items-center gap-2"
            data-testid="add-section-button"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="sections-grid">
            {sections.map((section) => (
              <div key={section._id} className="card" data-testid={`section-card-${section.name}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                      {section.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{section.departmentId?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                      data-testid={`edit-section-${section.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section._id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                      data-testid={`delete-section-${section.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Teacher: {section.teacherId?.name || 'Not Assigned'}</p>
                  <p>Students: {section.studentIds?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="section-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              {editMode ? 'Edit Section' : 'Add Section'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <input
                  type="text"
                  data-testid="section-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                  placeholder="e.g., CSE-A, CSE-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  data-testid="section-dept-select"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Teacher (Optional)</label>
                <select
                  data-testid="section-teacher-select"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', departmentId: '', teacherId: '' });
                    setEditMode(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary" data-testid="submit-section-button">
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

export default SectionsPage;