import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Filter,
  Search,
  Edit
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

import { adminAPI, usersAPI } from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [editingIssue, setEditingIssue] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'issues') {
      loadIssues();
    }
  }, [activeTab, filters]);

  const loadDashboardData = async () => {
    try {
      const [statsRes, authoritiesRes] = await Promise.all([
        adminAPI.getStats(),
        usersAPI.getAuthorities()
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (authoritiesRes.data.success) setAuthorities(authoritiesRes.data.data.authorities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async () => {
    try {
      const response = await adminAPI.getIssues(filters);
      if (response.data.success) {
        setIssues(response.data.data.issues);
      }
    } catch (error) {
      console.error('Error loading issues:', error);
    }
  };

  const handleStatusUpdate = async (issueId, status, message = '', priority = '') => {
    try {
      const response = await adminAPI.updateStatus(issueId, { status, message, priority });
      if (response.data.success) {
        loadIssues(); // Refresh issues list
        setEditingIssue(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignment = async (issueId, assignedTo, estimatedCost = '') => {
    try {
      const response = await adminAPI.assignIssue(issueId, { assignedTo, estimatedCost });
      if (response.data.success) {
        loadIssues(); // Refresh issues list
        setEditingIssue(null);
      }
    } catch (error) {
      console.error('Error assigning issue:', error);
    }
  };

  const getStatusBadge = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage road issues and monitor system performance
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'issues', label: 'Issues Management' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Issues</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.overview?.total || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.statusStats?.find(s => s._id === 'pending')?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-3 rounded-lg mr-4">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(stats.statusStats?.find(s => s._id === 'in-progress')?.count || 0) +
                          (stats.statusStats?.find(s => s._id === 'assigned')?.count || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.statusStats?.find(s => s._id === 'resolved')?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Issues */}
            {stats?.recentIssues && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Issues
                </h3>

                {/* ✅ Responsive Table with horizontal scroll */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600 min-w-[800px]">
                    <thead className="bg-gray-100 text-gray-900 font-semibold">
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4">S.No</th>
                        <th className="py-3 px-4">Issue ID</th>
                        <th className="py-3 px-4">Issue Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Reported By</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Upvotes</th>
                        <th className="py-3 px-4">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentIssues.map((issue, index) => (
                        <tr
                          key={issue.issueId}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4 text-xs font-medium text-primary-600">
                            {issue.issueId}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {issue.title}
                          </td>
                          <td className="py-3 px-4 capitalize">{issue.category}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {issue.reportedBy?.name || "Anonymous"}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {formatDate(issue.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={getStatusBadge(issue.status)}>
                              {issue.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-4">{issue.upvotesCount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${issue.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : issue.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                                }`}
                            >
                              {issue.priority || "Normal"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    className="form-input pl-10"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                  className="form-select"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                  <option value="in-progress">In Progress</option>
                  <option value="assigned">Assigned</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value, page: 1 }))}
                  className="form-select"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                  className="form-select"
                >
                  <option value="">All Categories</option>
                  <option value="pothole">Pothole</option>
                  <option value="traffic-light">Traffic Light</option>
                  <option value="road-damage">Road Damage</option>
                  <option value="drainage">Drainage</option>
                  <option value="streetlight">Street Light</option>
                  <option value="signage">Road Signage</option>
                  <option value="construction">Construction</option>
                  <option value="accident-prone">Accident Prone</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Issues List */}

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 min-w-[1000px]">
                  <thead className="bg-gray-100 text-gray-900 font-semibold">
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4">S.No</th>
                      <th className="py-3 px-4">Issue ID</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Reported By</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue, index) => (
                      <tr key={issue._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium text-primary-600">
                          {issue.issueId}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">{issue.title}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                          {issue.category.replace("-", " ")}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(issue.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(issue.status)}>
                            {issue.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`status-badge ${issue.priority === "high" || issue.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : issue.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {issue.priority || "medium"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {issue.reportedBy?.name}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setEditingIssue(issue)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">

            {/* Issues by Category - Bar Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Issues by Category
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryStats}>
                    <XAxis dataKey="_id" tickFormatter={val => val.replace('-', ' ')} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Total Issues" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Issues by Status - Pie Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Issues by Status
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusStats}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.statusStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry._id === "pending" ? "#facc15" :
                              entry._id === "in-progress" ? "#f97316" :
                                entry._id === "resolved" ? "#22c55e" : "#3b82f6"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Issue Trends - Line + Bar Chart */}
            {stats.monthlyTrends && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Issue Reports
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyTrends}>
                      <XAxis
                        dataKey="_id.month"
                        tickFormatter={(val, index) => {
                          const trend = stats.monthlyTrends[index];
                          return new Date(trend._id.year, trend._id.month - 1)
                            .toLocaleDateString("en-US", { month: "short" });
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0 && payload[0].payload && payload[0].payload._id) {
                            const trend = payload[0].payload;
                            return new Date(trend._id.year, trend._id.month - 1)
                              .toLocaleDateString("en-US", { month: "long", year: "numeric" });
                          }
                          return "";
                        }}
                      />

                      <Legend />
                      <Bar dataKey="count" fill="#10b981" name="Issues" />
                      <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        )}


        {/* Edit Issue Modal */}
        {editingIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Manage Issue: {editingIssue.issueId}
                </h2>

                <div className="space-y-6">
                  {/* Issue Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{editingIssue.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{editingIssue.description}</p>
                    <p className="text-sm text-gray-500">
                      Category: {editingIssue.category.replace('-', ' ')} |
                      Location: {editingIssue.location.address}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        defaultValue={editingIssue.status}
                        className="form-select"
                        id="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                        <option value="in-progress">In Progress</option>
                        <option value="assigned">Assigned</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <select
                        defaultValue={editingIssue.priority || 'medium'}
                        className="form-select"
                        id="priority-select"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <textarea
                      placeholder="Add a message about this status change..."
                      className="form-textarea mt-2"
                      rows="3"
                      id="status-message"
                    ></textarea>

                    <button
                      onClick={() => {
                        const status = document.getElementById('status-select').value;
                        const priority = document.getElementById('priority-select').value;
                        const message = document.getElementById('status-message').value;
                        handleStatusUpdate(editingIssue._id, status, message, priority);
                      }}
                      className="btn-primary mt-2"
                    >
                      Update Status
                    </button>
                  </div>

                  {/* Assignment */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assign to Authority</h4>
                    <div className="space-y-2">
                      <select
                        defaultValue={editingIssue.assignedTo?._id || ''}
                        className="form-select"
                        id="assign-select"
                      >
                        <option value="">Unassigned</option>
                        {authorities.map((auth) => (
                          <option key={auth._id} value={auth._id}>
                            {auth.name} ({auth.role})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Estimated cost (optional)"
                        className="form-input"
                        id="cost-input"
                        defaultValue={editingIssue.estimatedCost || ''}
                      />

                      <button
                        onClick={() => {
                          const assignedTo = document.getElementById('assign-select').value;
                          const estimatedCost = document.getElementById('cost-input').value;
                          handleAssignment(editingIssue._id, assignedTo || null, estimatedCost);
                        }}
                        className="btn-secondary"
                      >
                        Update Assignment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setEditingIssue(null)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;