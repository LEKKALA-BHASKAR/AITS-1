import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout';
import { Calendar, FileText, Award, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StudentDashboard = ({ user, onLogout }) => {
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token missing');
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        const [attendanceRes, resultsRes, achievementsRes] = await Promise.all([
          axios.get(`${API}/attendance/student/${user._id}`, { headers }),
          axios.get(`${API}/results/student/${user._id}`, { headers }),
          axios.get(`${API}/achievements/student/${user._id}`, { headers })
        ]);
        
        // Safe data extraction with fallbacks
        if (isMounted) {
          setAttendance(attendanceRes.data?.data || null);
          setResults(resultsRes.data?.data || []);
          setAchievements(achievementsRes.data?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Dashboard data fetch error:', error);
          toast.error('Failed to load dashboard data');
          // Set default values on error
          setAttendance(null);
          setResults([]);
          setAchievements([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user?._id]); // Added dependency

  // Calculate attendance percentage safely
  const getAttendancePercentage = () => {
    if (!attendance?.statistics?.percentage) return 0;
    const percentage = parseFloat(attendance.statistics.percentage);
    return isNaN(percentage) ? 0 : percentage;
  };

  const attendancePercentage = getAttendancePercentage();

  const stats = [
    { 
      title: 'Attendance', 
      value: `${attendancePercentage}%`, 
      icon: Calendar, 
      color: 'bg-blue-500',
      status: attendancePercentage >= 75 ? 'good' : 'warning'
    },
    { 
      title: 'Total Results', 
      value: results?.length || 0, 
      icon: FileText, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Achievements', 
      value: achievements?.length || 0, 
      icon: Award, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Backlogs', 
      value: user?.backlogCount || 0, 
      icon: AlertTriangle, 
      color: 'bg-red-500' 
    },
  ];

  // Safe user data access
  const userRollNumber = user?.rollNumber || 'N/A';
  const userDepartment = user?.departmentId?.name || 'N/A';
  const userSection = user?.sectionId?.name || 'N/A';
  const userStatus = user?.status || 'Unknown';
  const isAtRisk = user?.atRisk || false;

  return (
    <StudentLayout user={user} onLogout={onLogout} title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card" data-testid={`stat-card-${index}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2" style={{ fontFamily: 'Space Grotesk' }}>
                        {stat.value}
                      </p>
                      {stat.status === 'warning' && (
                        <p className="text-xs text-red-600 mt-1">Below 75%</p>
                      )}
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Student Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Roll Number:</span>
                  <span className="font-medium">{userRollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{userDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Section:</span>
                  <span className="font-medium">{userSection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`badge ${isAtRisk ? 'badge-danger' : 'badge-success'}`}>
                    {isAtRisk ? 'At Risk' : userStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Recent Achievements</h2>
              {achievements?.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Date not available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No achievements yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentDashboard;