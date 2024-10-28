import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">About RDVISION</h1>
                    <p className="text-lg text-gray-600">
                        Empowering businesses through innovative solutions and cutting-edge technology.
                    </p>
                </div>

                {/* Company Overview Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
                    <p className="text-gray-600 leading-relaxed">
                        RDVISION is a forward-thinking technology company dedicated to delivering world-class solutions for businesses. 
                        We specialize in providing custom software, web development, and IT consultancy services to help organizations 
                        achieve their goals efficiently and effectively.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                        Our team is composed of experienced professionals who are passionate about leveraging the latest technology to 
                        drive business success. We take pride in building long-lasting partnerships with our clients by delivering 
                        results that exceed their expectations.
                    </p>
                </div>

                {/* Vision and Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vision */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To become a global leader in the technology space by consistently delivering innovative and effective 
                            solutions that transform businesses.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our mission is to empower businesses with cutting-edge technology solutions that enhance productivity, 
                            streamline operations, and foster growth. We strive to be a trusted partner by delivering exceptional 
                            service and tailored solutions that meet the unique needs of our clients.
                        </p>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Core Values</h2>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Innovation: We embrace creativity and constantly seek to improve through innovative thinking.</li>
                        <li>Integrity: We uphold the highest standards of honesty and ethical conduct in everything we do.</li>
                        <li>Customer Success: Our clients' success is our top priority, and we work tirelessly to achieve it.</li>
                        <li>Collaboration: We believe in teamwork and actively collaborate with clients to deliver the best results.</li>
                        <li>Excellence: We strive for excellence in every project we undertake, no matter how big or small.</li>
                    </ul>
                </div>

                {/* Team Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our team consists of talented professionals from diverse backgrounds, united by a common passion for technology 
                        and excellence. We bring together a blend of technical expertise and industry experience to deliver exceptional 
                        solutions that drive success.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
