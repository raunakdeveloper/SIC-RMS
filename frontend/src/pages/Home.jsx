import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { issuesAPI, usersAPI } from "../utils/api";
import HeroCarousel from "../components/HeroCarousel";
import PartnerOrganizations from "../components/PartnerOrganizations";
import Footer from "../components/Footer";
import mainImage from "../assets/main.png";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, issuesRes] = await Promise.all([
        issuesAPI.getStats(),
        issuesAPI.getIssues({ limit: 6, sortBy: "createdAt" }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (issuesRes.data.success) setRecentIssues(issuesRes.data.data.issues);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      "in-progress": "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
    };
    return `px-2 py-1 rounded text-xs font-medium ${badges[status] || "bg-gray-100 text-gray-800"}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Carousel Section */}
      <HeroCarousel />
      <div className="h-6 md:h-10"></div>

      {/* Hero Section */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: `url(${mainImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/90"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-lg">
            Together for Safer Roads
          </h1>

          {/* Sub Heading */}
          <h2 className="text-2xl md:text-4xl font-semibold text-primary-200 mb-6 tracking-wide drop-shadow">
            Report. Track. Transform.
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of citizens in building better infrastructure.
            Your small action can create big change — report issues, follow progress,
            and help shape safer, smarter communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/report"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg 
                   font-bold text-lg md:text-xl shadow-lg 
                   hover:bg-primary-100 hover:text-primary-800 
                   transition-all duration-200"
            >
              Report an Issue
            </Link>
            <Link
              to="/issues"
              className="bg-transparent border-2 border-white text-white 
                   px-8 py-4 rounded-lg font-bold text-lg md:text-xl 
                   hover:bg-white hover:text-primary-700 
                   transition-all duration-200"
            >
              Browse Issues
            </Link>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Impact by Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real numbers, real progress in making our roads better
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard
                icon={<MapPin />}
                value={stats.overview?.total || 0}
                label="Total Issues Reported"
                bg="bg-blue-100"
                color="text-blue-600"
              />
              <StatCard
                icon={<CheckCircle />}
                value={stats.overview?.resolved || 0}
                label="Issues Resolved"
                bg="bg-green-100"
                color="text-green-600"
              />
              <StatCard
                icon={<Clock />}
                value={stats.overview?.inProgress || 0}
                label="In Progress"
                bg="bg-orange-100"
                color="text-orange-600"
              />
              <StatCard
                icon={<TrendingUp />}
                value={stats.overview?.pending || 0}
                label="Pending Review"
                bg="bg-yellow-100"
                color="text-yellow-600"
              />
            </div>
          )}
        </div>
      </section>


      {/* Latest Issues */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Latest Issues
              </h2>
              <p className="text-lg text-gray-600">
                Latest reports from our community
              </p>
            </div>
            <Link
              to="/issues"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues
              ?.sort((a, b) => b.upvotesCount - a.upvotesCount)
              .slice(0, 6)
              .map((issue) => (
                <div
                  key={issue._id}
                  className="card card-hover break-words overflow-hidden p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                >
                  {/* Top Info: Issue ID & Status */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-base font-semibold text-primary-600">
                      {issue.issueId}
                    </span>
                    <span className={getStatusBadge(issue.status)}>
                      {issue.status.replace("-", " ")}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {issue.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>

                  {/* Location & Upvotes */}
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-1 truncate">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {issue.location?.address || "No Address"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-5 w-5 text-yellow-500" />
                      <span className="text-base font-semibold">
                        {issue.upvotesCount} votes
                      </span>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="mt-4">
                    <Link
                      to={`/issue/${issue._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>


      {/* Authorities Section */}
      <PartnerOrganizations />

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            Ready to Take Action?
          </h2>

          {/* Sub Heading */}
          <h3 className="text-xl md:text-2xl text-primary-100 font-medium mb-6 tracking-wide">
            Your voice matters. Your report counts.
          </h3>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-50 mb-10 leading-relaxed">
            Join our growing community of responsible citizens.
            Together we can highlight issues, demand accountability, and build safer roads
            for the generations to come.
          </p>

          {/* CTA Button */}
          <Link
            to="/report"
            className="inline-flex items-center space-x-2 px-8 py-4 
                 rounded-xl font-semibold text-lg md:text-xl
                 bg-white text-primary-700 shadow-lg 
                 hover:bg-primary-50 hover:shadow-xl
                 transition duration-200"
          >
            <MapPin className="h-6 w-6" />
            <span>Report Your First Issue</span>
          </Link>

        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/30 to-transparent"></div>
      </section>



      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label, bg, color }) => (
  <div className="text-center">
    <div className={`${bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
      {React.cloneElement(icon, { className: `h-8 w-8 ${color}` })}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default Home;
