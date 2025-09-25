import React from 'react';
import { MapPin, Users, Shield, Target, CheckCircle, MapIcon } from 'lucide-react';
import Footer from '../components/Footer'; // Assuming you have a Footer component

const About = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary-600" />,
      title: 'Easy Reporting',
      description: 'Report road issues with just a few clicks using our intuitive interface and interactive maps.'
    },
    {
      icon: <Users className="h-8 w-8 text-secondary-600" />,
      title: 'Community Driven',
      description: 'Citizens can upvote issues and add comments to help prioritize urgent road problems.'
    },
    {
      icon: <Shield className="h-8 w-8 text-accent-600" />,
      title: 'Authority Response',
      description: 'Local authorities receive real-time notifications and can update issue status transparently.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary-600" />,
      title: 'Progress Tracking',
      description: 'Track the status of reported issues from submission to resolution with detailed timelines.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About RMS</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Building safer roads through community engagement and transparent governance
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The Road Management System (RMS) is a citizen-centric platform designed to
                bridge the gap between communities and local authorities in addressing road
                infrastructure issues.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We believe that by empowering citizens to easily report problems and enabling
                transparent communication with authorities, we can create safer, better-maintained
                roads for everyone.
              </p>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Transparent issue tracking</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Real-time status updates</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Community engagement</span>
              </div>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapIcon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Making a Difference</h3>
                <p className="text-gray-700">
                  Every report contributes to building safer, more accessible roads
                  for our communities. Together, we can create lasting positive change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (How RMS Works) */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">How RMS Works</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Our platform connects citizens, authorities, and communities to improve road infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">The RMS Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From issue identification to resolution - here's how we make it happen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Report Issue</h3>
              <p className="text-gray-600">
                Citizens identify and report road issues using our mobile-friendly platform with GPS location and photo upload capabilities.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authority Review</h3>
              <p className="text-gray-600">
                Local authorities receive notifications, review reports, assess priority levels, and assign appropriate teams for resolution.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Resolution & Updates</h3>
              <p className="text-gray-600">
                Progress is tracked transparently with status updates sent to reporters and the community throughout the resolution process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
