import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TeachersPage = ({ user, onLogout }) => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    email: '',
    password: '',
    departmentId: '',
    phone: '',
    designation: '',
    experience: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [teachersRes, deptsRes] = await Promise.all([
        axios.get(`${API}/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/departments`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setTeachers(teachersRes.data.data);
      setDepartments(deptsRes.data.data);
    } catch (error) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API}/teachers`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Teacher created successfully');
      setShowModal(false);
      setFormData({
        name: '',
        teacherId: '',
        email: '',
        password: '',
        departmentId: '',
        phone: '',
        designation: '',
        experience: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create teacher');
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Teachers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage all teachers</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="add-teacher-button"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="teachers-grid">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="card" data-testid={`teacher-card-${teacher.teacherId}`}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">{teacher.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{teacher.teacherId}</p>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <p><span className="font-medium">Department:</span> {teacher.departmentId?.name || 'N/A'}</p>
                  <p><span className="font-medium">Designation:</span> {teacher.designation || 'N/A'}</p>
                  <p><span className="font-medium">Experience:</span> {teacher.experience || 0} years</p>
                  <p><span className="font-medium">Sections:</span> {teacher.assignedSections?.length || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="teacher-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Add Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    data-testid="teacher-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher ID</label>
                  <input
                    type="text"
                    data-testid="teacher-id-input"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    data-testid="teacher-email-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    data-testid="teacher-password-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    data-testid="teacher-dept-select"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    data-testid="teacher-phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                    data-testid="teacher-designation-input"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Assistant Professor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    data-testid="teacher-experience-input"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary" data-testid="submit-teacher-button">
                  Create Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeachersPage;