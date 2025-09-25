import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowUpDown, Filter } from 'lucide-react';
import { issuesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Issues = () => {
  const { isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    status: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  const statuses = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Reported' },
    { value: 'upvotesCount', label: 'Most Upvoted' },
    { value: 'title', label: 'Title' }
  ];

  useEffect(() => {
    loadIssues();
  }, [filters]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issuesAPI.getIssues(filters);
      if (response.data.success) {
        setIssues(response.data.data.issues);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            List of Reported Issues
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-6">
            Browse and track the status of road issues reported by citizens
          </p>
          <Link
            to="/report"
            className="inline-flex items-center text-lg font-extrabold text-white group hover:text-white/90"
          >
            Report Issue
            <span className="ml-3 text-white text-2xl font-extrabold transition-transform transform group-hover:translate-x-3">
              &rarr;
            </span>
          </Link>
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="card mb-8 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </form>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select w-full lg:w-40"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="form-select w-full lg:w-44"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFilterChange('order', filters.order === 'desc' ? 'asc' : 'desc')}
                className="btn-outline p-2"
              >
                <ArrowUpDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Issues Table */}
        {!loading && issues.length > 0 && (
          <div className="card overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Issues
            </h3>
            <table className="w-full text-sm text-left text-gray-600 min-w-[800px]">
              <thead className="bg-gray-100 text-gray-900 font-semibold uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-3 w-14">S.No</th>
                  <th className="px-4 py-3 w-40">Issue ID</th>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Reported By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Upvotes</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, index) => (
                  <tr
                    key={issue._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3">{(filters.page - 1) * filters.limit + index + 1}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{issue.issueId}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{issue.title}</td>
                    <td className="px-4 py-3 capitalize">{issue.category}</td>
                    <td className="px-4 py-3">{issue.reportedBy?.name || "Anonymous"}</td>
                    <td className="px-4 py-3">{formatDate(issue.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}
                      >
                        {issue.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{issue.upvotesCount}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/issue/${issue._id}`}
                        className="btn-outline text-xs px-3 py-1 rounded-md"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading / No data */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        )}
        {!loading && issues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No issues found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Issues;
