import React from "react";
import logo1 from "../assets/partner/logo1.png";
import logo2 from "../assets/partner/logo2.jpeg";
import logo3 from "../assets/partner/logo3.png";
import logo4 from "../assets/partner/logo4.png";
import logo5 from "../assets/partner/logo5.png";

const PartnerOrganizations = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Our Partner Organizations
          </h2>
        </div>

        {/* Responsive Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {logos.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <img
                src={src}
                alt={`Partner ${idx + 1}`}
                className="max-h-18 sm:max-h-26 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerOrganizations;
