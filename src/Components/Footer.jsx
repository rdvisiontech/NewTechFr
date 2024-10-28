import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../Authorisation/AuthContext';

function Footer() {
    const { isDisabled } = useAuth();
    return (
        <>
            {!isDisabled ? (
                <footer className="w-full bg-[#1462dd] text-white pb-4">
                    <div className="text-center text-sm animate-fadeInUp">
                        <p>&copy; {new Date().getFullYear()} RDVISION. All rights reserved.</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            {/* Social Media Icons */}
                            <a href="https://www.instagram.com/rdvision.tech?igsh=MWhiMmdhOHo0bHlzbw==" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-all" >
                                <FontAwesomeIcon icon={faInstagram} size="2x" />
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-all">
                                <FontAwesomeIcon icon={faFacebook} size="2x" />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-all">
                                <FontAwesomeIcon icon={faTwitter} size="2x" />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-all">
                                <FontAwesomeIcon icon={faLinkedin} size="2x" />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-all">
                                <FontAwesomeIcon icon={faYoutube} size="2x" />
                            </a>
                        </div>
                    </div>
                </footer>
            ) : ""}
        </>
    );
}

export default Footer;
