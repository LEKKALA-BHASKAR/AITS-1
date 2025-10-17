import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { GraduationCap } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      
      if (response.data.success) {
        toast.success('Login successful!');
        onLogin(response.data.user, response.data.token);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>AITS CSMS</h1>
            <p className="text-gray-600 mt-2">Centralized Student Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                data-testid="email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                data-testid="password-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Login As</label>
              <select
                data-testid="role-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button
              type="submit"
              data-testid="login-button"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Admin: admin@aits.edu | password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;