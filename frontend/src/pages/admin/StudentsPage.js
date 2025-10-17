import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StudentsPage = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ departmentId: '', sectionId: '', status: '', atRisk: '' });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    departmentId: '',
    sectionId: '',
    phone: '',
    guardianName: '',
    guardianPhone: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const [studentsRes, deptsRes, sectionsRes] = await Promise.all([
        axios.get(`${API}/students?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/departments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/sections`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStudents(studentsRes.data.data);
      setDepartments(deptsRes.data.data);
      setSections(sectionsRes.data.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API}/students`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Student created successfully');
      setShowModal(false);
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        password: '',
        departmentId: '',
        sectionId: '',
        phone: '',
        guardianName: '',
        guardianPhone: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student');
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Students">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <p className="text-gray-600">Manage all students</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="add-student-button"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              data-testid="filter-department"
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            <select
              data-testid="filter-section"
              value={filters.sectionId}
              onChange={(e) => setFilters({ ...filters, sectionId: e.target.value })}
              className="input-field"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
            <select
              data-testid="filter-status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              data-testid="filter-at-risk"
              value={filters.atRisk}
              onChange={(e) => setFilters({ ...filters, atRisk: e.target.value })}
              className="input-field"
            >
              <option value="">All Students</option>
              <option value="true">At Risk</option>
              <option value="false">Not At Risk</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="card" data-testid="students-table">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Department</th>
                    <th className="text-left py-3 px-4 font-semibold">Section</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`student-row-${student.rollNumber}`}>
                      <td className="py-3 px-4">{student.rollNumber}</td>
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-sm">{student.departmentId?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{student.sectionId?.name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          student.atRisk ? 'badge-danger' : 
                          student.status === 'Active' ? 'badge-success' : 'badge-primary'
                        }`}>
                          {student.atRisk ? 'At Risk' : student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="text-center py-8 text-gray-500">No students found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="student-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Add Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    data-testid="student-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                  <input
                    type="text"
                    data-testid="student-roll-input"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    data-testid="student-email-input"
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
                    data-testid="student-password-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    data-testid="student-dept-select"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <select
                    data-testid="student-section-select"
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Section</option>
                    {sections.filter(s => s.departmentId?._id === formData.departmentId).map((section) => (
                      <option key={section._id} value={section._id}>{section.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    data-testid="student-phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name</label>
                  <input
                    type="text"
                    data-testid="student-guardian-input"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Phone</label>
                  <input
                    type="tel"
                    data-testid="student-guardian-phone-input"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="input-field"
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
                <button type="submit" className="flex-1 btn-primary" data-testid="submit-student-button">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudentsPage;