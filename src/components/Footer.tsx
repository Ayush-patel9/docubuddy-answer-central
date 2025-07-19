import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Globe, MapPin, Phone } from 'lucide-react';

const socialLinks = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/docubuddy',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/docubuddy',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/docubuddy',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/docubuddy',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/docubuddy',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    ),
  },
];

const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Us', icon: '🏢' },
    { id: 'how-it-works', label: 'How It Works', icon: '⚡' },
    { id: 'contact', label: 'Contact', icon: '📞' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-xl">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-4">About DocuBuddy</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                DocuBuddy is your intelligent document management companion that revolutionizes how teams store, search, and collaborate on documents. We integrate seamlessly with your favorite cloud services to create a unified workspace for enhanced productivity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-semibold text-white mb-2">Secure</h4>
                  <p className="text-blue-100 text-sm">Enterprise-grade security for your documents</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-2xl mb-2">🤖</div>
                  <h4 className="font-semibold text-white mb-2">AI-Powered</h4>
                  <p className="text-blue-100 text-sm">Smart search and organization features</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-2xl mb-2">🌐</div>
                  <h4 className="font-semibold text-white mb-2">Integrated</h4>
                  <p className="text-blue-100 text-sm">Works with all your favorite tools</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'how-it-works':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
                <p className="text-green-100 text-lg">Get started in just 3 simple steps</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Connect</h4>
                  <p className="text-green-100 text-sm">Link your Google Drive, Notion, and other cloud accounts securely</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Organize</h4>
                  <p className="text-green-100 text-sm">Our AI automatically indexes and organizes all your documents</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Collaborate</h4>
                  <p className="text-green-100 text-sm">Search, chat, and work together with intelligent insights</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
                <p className="text-purple-100 text-lg">We'd love to hear from you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <Mail className="w-5 h-5 text-purple-200" />
                    <span>support@docubuddy.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-5 h-5 text-purple-200" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Globe className="w-5 h-5 text-purple-200" />
                    <span>www.docubuddy.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5 text-purple-200" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${link.name}`}
                        className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur"
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 mt-24">
      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur rounded-full p-2 border border-gray-700">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50 pt-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">DB</span>
              </div>
              <span>&copy; {new Date().getFullYear()} DocuBuddy. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors hover:underline">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
