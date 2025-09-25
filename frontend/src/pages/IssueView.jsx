import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  MapPin,
  ChevronUp,
  Calendar,
  User,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { issuesAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const IssueView = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Success message from location state
  const successMessage = location.state?.message;

  useEffect(() => {
    loadIssue();
  }, [id]);

  const loadIssue = async () => {
    try {
      setLoading(true);
      const response = await issuesAPI.getIssue(id);

      if (response.data.success) {
        setIssue(response.data.data.issue);
        setComments(response.data.data.comments);
        setUserVote(response.data.data.userVote);
      }
    } catch (error) {
      console.error("Error loading issue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await issuesAPI.voteIssue(id, "upvote");
      if (response.data.success) {
        // Update issue data
        setIssue(response.data.data.issue);

        // Update user vote state
        if (response.data.data.action === "removed") {
          setUserVote(null);
        } else {
          setUserVote("upvote");
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const response = await issuesAPI.addComment(id, commentText);

      if (response.data.success) {
        setComments([response.data.data.comment, ...comments]);
        setCommentText("");

        // Update issue comment count
        setIssue((prev) => ({
          ...prev,
          commentsCount: prev.commentsCount + 1,
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-5 w-5 text-yellow-500" />,
      approved: <CheckCircle className="h-5 w-5 text-blue-500" />,
      declined: <AlertTriangle className="h-5 w-5 text-red-500" />,
      "in-progress": <Clock className="h-5 w-5 text-orange-500" />,
      assigned: <User className="h-5 w-5 text-purple-500" />,
      resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
    };
    return icons[status] || icons.pending;
  };

  const getStatusBadge = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Issue Not Found
          </h2>
          <p className="text-gray-600">
            The issue you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}
        {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={() => window.history.back()}
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 border border-gray-300 shadow-sm  text-primary-700 font-semibold transition-all duration-200 group"
                  style={{ boxShadow: '0 2px 8px 0 rgba(16,30,54,0.06)' }}
                >
                  <svg className="text-white h-5 w-5 text-primary-600 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  <span className="text-white">Back</span>
                </button>
              </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Details */}
            <div className="card">
              

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm font-medium text-primary-600">
                    {issue.issueId}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">
                    {issue.title}
                  </h1>
                  <div className="text-sm text-primary-600 font-medium mt-1 capitalize">
                    {issue.category.replace("-", " ")}
                  </div>
                </div>
                <span className={getStatusBadge(issue.status)}>
                  {issue.status.replace("-", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {issue.description}
              </p>

              {/* Image */}
              {issue.imageUrl && (
                <div className="mb-6">
                  <img
                    src={issue.imageUrl}
                    alt="Issue"
                    className="w-full max-w-2xl h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <button
                  onClick={handleVote}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    userVote === "upvote"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ChevronUp className="h-5 w-5" />
                  <span>{issue.upvotesCount} votes</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{issue.commentsCount} feedbacks</span>
                </div>
              </div>
            </div>

            {/* Map */}

            <div className="card" style={{ position: "relative", zIndex: 1 }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="h-64 rounded-lg overflow-hidden mb-4">
                <MapContainer
                  center={[issue.location.lat, issue.location.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[issue.location.lat, issue.location.lng]} />
                </MapContainer>
              </div>

              <div className="flex items-start space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-700">{issue.location.address}</p>
              </div>

              {/* Location Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`,
                      "_blank"
                    )
                  }
                  className="btn-outline px-4 py-2 text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => {
                    const mapLink = `https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`;
                    navigator.clipboard.writeText(mapLink);
                    alert("Location link copied!");
                  }}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Copy
                </button>

                <button
                  onClick={async () => {
                    const mapLink = `https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: issue.title,
                          text: `Check out this issue location: ${issue.title}`,
                          url: mapLink,
                        });
                      } catch (error) {
                        console.error("Error sharing:", error);
                      }
                    } else {
                      alert("Sharing not supported in this browser");
                    }
                  }}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Feedbacks ({comments.length})
              </h3>

              {/* Add Feedback Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={
                        isAuthenticated
                          ? "Add feedback..."
                          : "Please log in to add feedback"
                      }
                      rows={3}
                      className="form-textarea"
                      disabled={!isAuthenticated}
                      maxLength={500}
                    />
                    {commentText && (
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {commentText.length}/500
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={
                      !isAuthenticated || !commentText.trim() || commentLoading
                    }
                    className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? (
                      <div className="spinner"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Feedbacks List */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border-l-4 border-gray-200 pl-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {comment.userId?.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No feedbacks yet. Be the first to give feedback!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Issue Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reported by:</span>
                  <span className="font-medium">{issue.reportedBy?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={getStatusBadge(issue.status)}>
                    {issue.status.replace("-", " ")}
                  </span>
                </div>
                {issue.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="font-medium">{issue.assignedTo.name}</span>
                  </div>
                )}
                {issue.priority && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span
                      className={`status-badge ${
                        issue.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : issue.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-4">
                {issue.history && issue.history.length > 0 ? (
                  issue.history
                    .sort(
                      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((event, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(event.action)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {event.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm">No timeline events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default IssueView;
