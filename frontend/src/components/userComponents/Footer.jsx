import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faTwitterSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [year] = useState(new Date().getFullYear());

  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-lg font-bold mb-1">Bookit</p>
          <p className="text-sm">&copy; {year} Bookit. All rights reserved.</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm mr-4">Follow us:</p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300 mr-4"
          >
            <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300 mr-4"
          >
            <FontAwesomeIcon icon={faTwitterSquare} size="lg" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <FontAwesomeIcon icon={faInstagramSquare} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
