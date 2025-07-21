import React from 'react';
import { Bot } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm py-12 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Fetchly AI</h3>
                <p className="text-xs text-slate-400">ANSWER CENTRAL</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Fighting misinformation with AI-powered fact-checking and real-time data visualization.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a href="/chat" className="text-slate-400 hover:text-white transition-colors text-sm">Create Charts</a></li>
              <li><a href="/drive" className="text-slate-400 hover:text-white transition-colors text-sm">Browse Files</a></li>
              <li><a href="/notion" className="text-slate-400 hover:text-white transition-colors text-sm">Notion Integration</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Community Guidelines</a></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-slate-400 hover:text-white text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-slate-400 hover:text-white text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-slate-400 hover:text-white text-xs font-bold">in</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Follow us for updates and tips
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2025 Fletchly.io - AI Data Platform. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs">
            <span className="text-slate-500">AI-Powered</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Secure</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">Real-time</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
