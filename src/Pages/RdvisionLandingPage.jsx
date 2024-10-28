import React, { useState } from 'react';
import image from '../assets/Images/cr.png';
import image1 from '../assets/Images/istockphoto-1254718662-612x612.jpg';
import image2 from '../assets/Images/automation-business-industrial-process-workflow-optimisation-software-development-concept-virtual-screen-141548980.webp';
import image3 from '../assets/Images/AIaaS.webp';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import ContactForm from '../Components/ContactForm';
import tailwind from '../assets/Images/tailwind-css3232.logowik Background Removed.com.png'
import mysql from '../assets/Images/mysql Background Removed.png'
import spring from '../assets/Images/spring Background Removed.png'
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faJsSquare, faJava, faNodeJs } from '@fortawesome/free-brands-svg-icons';
import software from '../assets/Images/istockphoto-1254718662-612x612.jpg'
import clooudImg from '../assets/Images/automation-business-industrial-process-workflow-optimisation-software-development-concept-virtual-screen-141548980.webp'
import ai from '../assets/Images/AIaaS.webp'


function RdvisionLandingPage() {
    const [isFormOpen, setFormOpen] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);

    const handleOpenForm = () => {
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
    };





    return (
        <div className="overflow-x-hidden font-roboto">
            {/* Hero Section */}
            <section className="bg-[#1462dd] text-white py-20">
                <div className="container mx-auto flex flex-col items-center text-center animate-fadeIn">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to rDvision Tech
                    </h1>
                    <p className="text-lg md:text-2xl mb-8">
                        Innovating the future with cutting-edge technology solutions.
                    </p>
                    <button
                        onClick={handleOpenForm}
                        className="bg-white text-[#1462dd] font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Learn More
                    </button>
                </div>
            </section>


            {/* Portfolio Section */}
            <section className="py-20 bg-gray-200">
                <div className="container mx-auto text-center animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1462dd] mb-12">
                        Our Portfolio
                    </h2>
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={3000}
                        className="portfolio-carousel"
                    >

                        <div>
                            <img src={image1} alt="Project 2" className="rounded-lg shadow-lg h-96" />
                            {/* <p className="legend">Project 2</p> */}
                        </div>
                        <div>
                            <img src={image2} alt="Project 3" className="rounded-lg shadow-lg h-96" />
                            {/* <p className="legend">Project 3</p> */}
                        </div>
                        <div>
                            <img src={image3} alt="Project 4" className="rounded-lg shadow-lg h-96" />
                            {/* <p className="legend">Project 4</p> */}
                        </div>
                    </Carousel>
                </div>
            </section>
            {/* Services Section */}
            <section className="bg-gray-200 py-10">
                <div className="container mx-auto text-center animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1462dd] mb-12">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Software Development',
                                description: 'We create custom software solutions tailored to your business needs, utilizing the latest technologies to deliver scalable and efficient applications.',
                                extraContent: 'Our development process includes detailed requirements analysis, agile development, and continuous testing to ensure the highest quality solutions.',
                                image: clooudImg // Replace with your image path
                            },
                            {
                                title: 'Cloud Computing',
                                description: 'Our cloud services help you optimize your infrastructure, enhance scalability, and reduce operational costs with secure and reliable cloud solutions.',
                                extraContent: 'We offer cloud migration, management, and optimization services, ensuring your cloud infrastructure is efficient and cost-effective.',
                                image: software  // Replace with your image path
                            },
                            {
                                title: 'AI & Machine Learning',
                                description: 'We leverage artificial intelligence and machine learning to drive innovation, providing intelligent solutions that can transform your business operations.',
                                extraContent: 'Our AI and ML solutions include predictive analytics, natural language processing, and custom model development to meet your specific needs.',
                                image: ai // Replace with your image path
                            }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="relative bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                                onMouseEnter={() => setHoveredService(index)}
                                onMouseLeave={() => setHoveredService(null)}
                            >
                                {/* Service Image */}
                                <img src={service.image} alt={service.title} className="w-full h-48 object-cover mb-4 rounded-lg" />

                                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                                <p>{service.description}</p>
                                {hoveredService === index && (
                                    <div className="absolute inset-0 bg-gray-800 bg-opacity-75 text-white flex items-center justify-center rounded-lg opacity-0 transition-opacity duration-300 ease-in-out">
                                        <p className="p-4">{service.extraContent}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack Section */}
            <section className="py-20 bg-white text-gray-800">
                <div className="container mx-auto text-center animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1462dd] mb-12">
                        Our Technology Stack
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <FontAwesomeIcon icon={faReact} className="w-full mb-4 fa-spin" style={{ color: '#74C0FC', fontSize: '5rem' }} />
                            <div className="text-center">React</div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <FontAwesomeIcon icon={faJsSquare} className="w-full mb-4 fa-beat-fade" style={{ color: '#007396', fontSize: '5rem' }} />
                            <div className="text-center">JavaScript</div>
                        </div>
                        
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <FontAwesomeIcon icon={faJava} className="w-full mb-4 fa-beat-fade" style={{ color: '#007396', fontSize: '5rem' }} />
                            <div className="text-center">Java</div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <FontAwesomeIcon icon={faNodeJs} className="w-full mb-4 fa-beat-fade" style={{ color: '#68A063', fontSize: '5rem' }} />
                            <div className="text-center">Node.js</div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <img src={tailwind} alt="Tailwind CSS" className="w-full mb-4 fa-spin" />
                            <div className="text-center">Tailwind CSS</div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <img src={spring} alt="Spring Boot" className="w-full mb-4 fa-spin" />
                            <div className="text-center">Spring Boot</div>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-32">
                            <img src={mysql} alt="MySQL" className="w-full mb-4 fa-spin" />
                            <div className="text-center">MySQL</div>
                        </div>
                    </div>
                </div>
            </section>


            {/* About Section */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-white text-gray-800">
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1462dd] mb-6 drop-shadow-lg">
                            About Us
                        </h2>
                        <p className="text-lg mb-6 transition-opacity duration-1000 ease-in-out animate-fadeIn" style={{ animationDelay: '0s' }}>
                            RDVISION Tech is at the forefront of technology innovation, providing state-of-the-art solutions for businesses across various industries. Our expertise spans software development, cloud computing, and AI, driving digital transformation for our clients worldwide.
                        </p>
                        <p className="text-lg mb-6 transition-opacity duration-1000 ease-in-out animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                            We specialize in developing robust and scalable websites that cater to the unique needs of businesses. Whether it's a dynamic e-commerce platform, a sleek corporate website, or a complex web application, our team delivers solutions that are not only visually appealing but also optimized for performance.
                        </p>
                        <p className="text-lg mb-6 transition-opacity duration-1000 ease-in-out animate-fadeIn" style={{ animationDelay: '1s' }}>
                            In addition to web development, we excel in digital marketing strategies designed to enhance your online presence and drive business growth. From search engine optimization (SEO) to social media marketing, our tailored campaigns ensure that your brand reaches the right audience effectively.
                        </p>
                        <p className="text-lg transition-opacity duration-1000 ease-in-out animate-fadeIn" style={{ animationDelay: '1.5s' }}>
                            Our commitment to innovation is reflected in our adoption of cutting-edge technologies and methodologies. We work closely with our clients to understand their business goals and provide solutions that are both innovative and practical. At RDVISION Tech, we believe in empowering businesses through technology, helping them navigate the complexities of the digital landscape with confidence.
                        </p>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="animate-slideLeft transform translate-x-0 hover:scale-105 transition duration-500 ease-in-out">
                            <img src={image} alt="About RDVISION Tech" className="w-full rounded-lg shadow-2xl hover:shadow-xl transition-shadow duration-300 ease-in-out" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1462dd] opacity-70 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Call to Action Section */}
            <section className="py-20 bg-[#1462dd] text-white">
                <div className="container mx-auto text-center animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Innovate with Us?
                    </h2>
                    <p className="text-lg mb-8">
                        Contact us today to discuss how we can help you achieve your technology goals.
                    </p>
                    <button
                        onClick={handleOpenForm}
                        className="bg-white text-[#1462dd] font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Get in Touch
                    </button>
                </div>
            </section>




            {/* Contact Form */}
            {/* <ContactForm isOpen={isFormOpen} onClose={handleCloseForm} /> */}
        </div>
    );
}

export default RdvisionLandingPage;
