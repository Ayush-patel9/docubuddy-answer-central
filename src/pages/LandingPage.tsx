import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileSearch, 
  TrendingUp, 
  Database, 
  Sparkles, 
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Shield,
  Zap,
  Brain
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 bg-slate-900">
                  <img src="/fb819e7a-d57c-49b2-87ed-ba96c3164a3a.webp" alt="Fletchly Logo" className="h-8 w-8 object-contain" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Fletchly.io</h1>
                <p className="text-xs text-slate-400 tracking-wider">AI DATA PLATFORM</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#charts" className="text-slate-300 hover:text-white transition-colors">Charts</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
              <Button
                onClick={() => navigate('/chat')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-600/20 text-blue-400 border-blue-500/30">
              ✨ AI-Powered Document Analysis
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}Excel Data
              </span>
              <br />
              Into Beautiful Charts
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Fighting misinformation with AI-powered fact-checking and real-time data visualization. 
              Transform your Google Drive Excel files into stunning interactive charts using natural language.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate('/chat')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold group"
              >
                Start Creating Charts
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg"
                onClick={() => navigate('/drive')}
              >
                Browse Examples
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10+</div>
                <div className="text-slate-400">Chart Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">Real-time</div>
                <div className="text-slate-400">Data Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">AI-Powered</div>
                <div className="text-slate-400">Natural Language</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to transform data into insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Natural Language Processing</h3>
              <p className="text-slate-300">
                Simply describe what chart you want in plain English. Our AI understands your intent and creates the perfect visualization.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Google Drive Integration</h3>
              <p className="text-slate-300">
                Seamlessly connect to your Google Drive and access Excel files instantly. No manual uploads required.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Processing</h3>
              <p className="text-slate-300">
                Get instant results with our high-performance backend. Process large datasets in seconds, not minutes.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multiple Chart Types</h3>
              <p className="text-slate-300">
                Create pie charts, bar charts, line graphs, histograms, and more. Perfect for any data visualization need.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-300">
                Your data stays secure with enterprise-grade security. We never store your sensitive information.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Designs</h3>
              <p className="text-slate-300">
                Professional-quality charts with modern styling, perfect for presentations and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Types Section */}
      <section id="charts" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Chart Types Available</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Express your data in the most effective way possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-colors">
              <PieChart className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Pie Charts</h3>
              <p className="text-slate-400 text-sm">Perfect for showing proportions and percentages</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-colors">
              <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Bar Charts</h3>
              <p className="text-slate-400 text-sm">Great for comparing different categories</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-colors">
              <LineChart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Line Charts</h3>
              <p className="text-slate-400 text-sm">Ideal for showing trends over time</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-colors">
              <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Area Charts</h3>
              <p className="text-slate-400 text-sm">Show cumulative totals over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-t border-slate-700/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Data?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating beautiful charts with natural language
          </p>
          
          <Button
            onClick={() => navigate('/chat')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold group"
          >
            Start Creating Now
            <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <img src="/robot-logo.svg" alt="Fletchly AI Robot" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Fletchly.io</h3>
                  <p className="text-xs text-slate-400 tracking-wider">AI DATA PLATFORM</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Transform your Excel data into beautiful charts with AI-powered analysis and visualization tools.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="/chat" className="text-slate-400 hover:text-white transition-colors text-sm">Create Charts</a></li>
                <li><a href="/drive" className="text-slate-400 hover:text-white transition-colors text-sm">Browse Files</a></li>
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-slate-400 text-sm">in</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Fletchly.io - AI Data Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
