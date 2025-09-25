import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, MapPin, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../utils/api';
import AuthModal from '../components/AuthModal';
import MapPicker from '../components/MapPicker';
import Footer from '../components/Footer';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: null,
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'traffic-light', label: 'Traffic Light Issue' },
    { value: 'road-damage', label: 'Road Damage' },
    { value: 'drainage', label: 'Drainage Problem' },
    { value: 'streetlight', label: 'Street Light' },
    { value: 'signage', label: 'Road Signage' },
    { value: 'construction', label: 'Construction Issue' },
    { value: 'accident-prone', label: 'Accident Prone Area' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      localStorage.setItem('pendingIssueReport', JSON.stringify(formData));
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await issuesAPI.createIssue(formData);
      if (response.data.success) {
        localStorage.removeItem('pendingIssueReport');
        navigate(`/issue/${response.data.data.issue._id}`, {
          state: { message: 'Issue reported successfully!' }
        });
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to report issue. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      const pendingReport = localStorage.getItem('pendingIssueReport');
      if (pendingReport) {
        try {
          const data = JSON.parse(pendingReport);
          setFormData(data);
        } catch (error) {
          console.error('Error loading pending report:', error);
        }
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Report an Issue
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-6">
            Help us improve road conditions by reporting issues in your area. Your report will be reviewed by local authorities.
          </p>
        
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Large pothole on Main Street"
                maxLength={200}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`form-textarea ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Provide detailed description..."
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                <span className="text-sm text-gray-500">{formData.description.length}/1000</span>
              </div>
            </div>

            {/* Location */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <MapPicker
                onLocationSelect={handleLocationSelect}
                selectedLocation={formData.location}
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address (Editable)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.location?.address || ''}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      location: prev.location ? { ...prev.location, address: e.target.value } : { address: e.target.value }
                    }));
                  }}
                  className="form-input"
                  placeholder="Edit address or enter manually"
                  style={{ position: 'relative', zIndex: 2 }}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <Camera className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const res = await issuesAPI.uploadImage(file);
                      if (res.data.success && res.data.url) {
                        setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
                      } else {
                        alert('Image upload failed.');
                      }
                    } catch (err) {
                      alert('Image upload failed.');
                    }
                  }}
                  className="form-input"
                />
              </div>
              {formData.imageUrl && <img src={formData.imageUrl} alt="Uploaded" className="h-24 rounded-lg border mt-2" />}
              <p className="text-sm text-gray-500 mt-1">
                Upload an image to help authorities understand the issue better
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/issues')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Report Issue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
          {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What happens next?
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Your report will be reviewed by local authorities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>You'll receive email updates on the status</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Track progress on the issue details page</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Other citizens can upvote to show support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ReportIssue;
