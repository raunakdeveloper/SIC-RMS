import React from 'react';
import { MapPin, AlertCircle, Shield, HelpCircle } from 'lucide-react';

const Resources = () => {
    const topics = [
        {
            icon: <MapPin className="h-8 w-8 text-primary-600" />,
            title: 'How to Report',
            description: `To report an issue, visit the Report Issue page, fill out the form with accurate details and location, and submit it. 
      If you are not logged in, log in first; you will then receive a confirmation email after successfully reporting.`
        },
        {
            icon: <AlertCircle className="h-8 w-8 text-secondary-600" />,
            title: 'Reporting Rules',
            description: `Ensure your report includes the issue title, detailed description, location, category, and any supporting images. 
      Reports are verified by authorities to prioritize urgent issues.`
        },
        {
            icon: <Shield className="h-8 w-8 text-accent-600" />,
            title: 'Road Safety Tips',
            description: `Follow safety guidelines while traveling: observe traffic signs, report hazards promptly, and maintain awareness of road conditions. 
      Your cooperation helps in creating safer roads for all.`
        }
    ];

    const faqItems = [
        {
            question: "Do I need to be registered to report an issue?",
            answer: "Yes, you need to log in to submit a report. If you try to report without logging in, you'll be prompted to log in first."
        },
        {
            question: "Can I edit my report after submission?",
            answer: "Yes, you can update the report details or add images until the issue is resolved."
        },
        {
            question: "How will I know my issue is being addressed?",
            answer: "You will receive email updates on status changes, and progress can also be tracked on the issue details page."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        RMS Resources
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                        Guides and tips to help citizens report issues efficiently and stay safe on the roads
                    </p>
                </div>
            </section>

            {/* Topics Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Explore Resources
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Essential guidance for reporting issues and ensuring road safety
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topics.map((topic, index) => (
                            <div key={index} className="flex h-full">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex-1 flex flex-col justify-center text-center">
                                    <div className="flex justify-center mb-4">
                                        {topic.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {topic.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {topic.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-6">
                            {faqItems.map((item, index) => (
                                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <div className="flex items-start space-x-3">
                                        <HelpCircle className="h-5 w-5 text-primary-500 mt-1" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                {item.question}
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Resources;
