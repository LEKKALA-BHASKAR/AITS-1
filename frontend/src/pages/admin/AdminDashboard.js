import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Users, GraduationCap, Building2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';


const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/search-student?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'bg-blue-500' },
    { title: 'Total Teachers', value: stats?.totalTeachers || 0, icon: Users, color: 'bg-green-500' },
    { title: 'Departments', value: stats?.totalDepartments || 0, icon: Building2, color: 'bg-purple-500' },
    { title: 'At Risk Students', value: stats?.atRiskStudents || 0, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card" data-testid={`stat-card-${index}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2" style={{ fontFamily: 'Space Grotesk' }}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Quick Search Student</h2>
            <form onSubmit={handleSearch} className="flex gap-4" data-testid="search-form">
              <input
                type="text"
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll number, or email"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary" data-testid="search-button">
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-6" data-testid="search-results">
                <h3 className="font-semibold mb-3">Search Results:</h3>
                <div className="space-y-3">
                  {searchResults.map((student) => (
                    <div key={student._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg" data-testid="search-result-item">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{student.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.rollNumber} | {student.email}</p>
                        <p className="text-sm text-gray-500">
                          {student.departmentId?.name} - {student.sectionId?.name}
                        </p>
                      </div>
                      <span className={`badge ${student.atRisk ? 'badge-danger' : 'badge-success'}`}>
                        {student.atRisk ? 'At Risk' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;