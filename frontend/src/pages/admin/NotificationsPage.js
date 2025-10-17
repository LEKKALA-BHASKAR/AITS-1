import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NotificationsPage = ({ user, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all',
    priority: 'medium'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API}/notifications`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notification sent successfully');
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        target: 'all',
        priority: 'medium'
      });
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-primary';
      case 'low': return 'badge-success';
      default: return 'badge-primary';
    }
  };

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Notifications">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Send and manage notifications</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="send-notification-button"
          >
            <Send className="w-5 h-5" />
            Send Notification
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4" data-testid="notifications-list">
            {notifications.map((notification) => (
              <div key={notification._id} className="card" data-testid={`notification-${notification._id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                        {notification.title}
                      </h3>
                      <span className={`badge ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Target: <span className="font-medium">{notification.target}</span></span>
                      <span>By: <span className="font-medium">{notification.postedBy?.name || 'Admin'}</span></span>
                      <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="card text-center py-12 text-gray-500">
                No notifications sent yet
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="notification-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Send Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  data-testid="notification-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  data-testid="notification-message-input"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field"
                  required
                  rows="4"
                  placeholder="Notification message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                  <select
                    data-testid="notification-target-select"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="input-field"
                  >
                    <option value="all">All Users</option>
                    <option value="students">All Students</option>
                    <option value="teachers">All Teachers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    data-testid="notification-priority-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                <button type="submit" className="flex-1 btn-primary" data-testid="submit-notification-button">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default NotificationsPage;