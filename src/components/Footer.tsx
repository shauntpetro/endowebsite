import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-display font-bold text-gold-400 mb-4">EndoCyclic Therapeutics</h3>
            <p className="text-gray-400">
              Pioneering non-hormonal therapeutics and AI-powered diagnostics for women's health.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-gold-400">About Us</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-gold-400">Products</a></li>
              <li><a href="#technology" className="text-gray-400 hover:text-gold-400">Technology</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-gold-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                5270 California Ave, Suite 300, Irvine, CA 92617
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                info@endocyclic.com
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} />
                (555) 123-4567
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-gold-400 text-white"
              />
              <button
                type="submit"
                className="w-full bg-gold-500 text-white py-2 px-4 rounded-md hover:bg-gold-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EndoCyclic Therapeutics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;