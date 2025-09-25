import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + About + Social */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="RMS Logo"
                className="h-12 w-12 rounded bg-white p-1 shadow-md"
              />
              <span className="text-2xl font-bold">RMS</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Road Management System (RMS) is a government initiative to help
              citizens report and track road issues efficiently.
            </p>
            <div className="flex space-x-3">
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/issues" text="Issues" />
              <FooterLink to="/report" text="Report Issue" />
              <FooterLink to="/about" text="About" />
              <FooterLink to="/contact" text="Contact" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/resources" text="FAQ Section" />
              <FooterLink to="/resources" text="How to Report" />
              <FooterLink to="/resources" text="Reporting Rules" />
              <FooterLink to="/resources" text="Road Safety Tips" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                <span>
                  University of Lucknow, Sitapur Road, <br />
                  Lucknow, Uttar Pradesh, 226024, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+91 1800 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>support@rms.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Road Management System, Govt. of
            India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, text }) {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-400 hover:text-blue-400 transition duration-300"
      >
        {text}
      </Link>
    </li>
  );
}

export default Footer;
