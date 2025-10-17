import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../../components/StudentLayout';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StudentProfile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user.phone || '',
    address: user.address || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/students/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully');
      setEditing(false);
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(updatedUser);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <StudentLayout user={user} onLogout={onLogout} title="Profile">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-3xl">{profile.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{profile.name}</h2>
              <p className="text-gray-600">{profile.rollNumber}</p>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="btn-primary"
              data-testid="edit-profile-button"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    data-testid="phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    data-testid="address-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" data-testid="save-profile-button">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{profile.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{profile.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{profile.departmentId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Section</p>
                    <p className="font-medium">{profile.sectionId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`badge ${profile.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Guardian Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Guardian Name</p>
                    <p className="font-medium">{profile.guardianName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guardian Phone</p>
                    <p className="font-medium">{profile.guardianPhone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;