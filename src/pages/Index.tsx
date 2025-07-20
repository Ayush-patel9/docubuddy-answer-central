import './index.css';

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, FileSearch, Users, LogOut, Bell, X, Clock, FileText, FolderOpen, Trash2, Settings, Brain, Sparkles, ChevronRight, TrendingUp, Zap, Database, Network } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Chat from "@/Chat";
import Footer from "@/components/Footer";

// Advanced Magnetic Cursor Component
const MagneticCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners to magnetic elements
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      magneticElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        className="magnetic-cursor"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `scale(${isHovering ? 1.5 : 1})`
        }}
      />
      <div 
        className="magnetic-cursor-trail"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`
        }}
      />
    </>
  );
};

// Advanced Floating Geometry System
const FloatingGeometrySystem = () => {
  const geometryRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (geometryRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.2;
        geometryRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={geometryRef} className="floating-geometry-system">
      {/* Floating Geometric Shapes */}
      <div className="floating-geometry triangle-1 animate-float-complex-1" />
      <div className="floating-geometry circle-1 animate-float-complex-2" />
      <div className="floating-geometry square-1 animate-float-complex-3" />
      <div className="floating-geometry hexagon-1 animate-float-complex-4" />
      <div className="floating-geometry diamond-1 animate-float-complex-5" />
      <div className="floating-geometry triangle-2 animate-float-complex-6" />
      <div className="floating-geometry circle-2 animate-float-complex-7" />
      
      {/* Grid Pattern Overlay */}
      <div className="grid-pattern animate-grid-pulse" />
      
      {/* Scanning Lines */}
      <div className="scan-line scan-horizontal animate-scan-h" />
      <div className="scan-line scan-vertical animate-scan-v" />
      
      {/* Energy Orbs */}
      <div className="energy-orb orb-1 animate-orb-path-1" />
      <div className="energy-orb orb-2 animate-orb-path-2" />
      <div className="energy-orb orb-3 animate-orb-path-3" />
    </div>
  );
};

// Staggered Entry Animation Component
const StaggeredElements = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`staggered-element ${isVisible ? 'animate-stagger-in' : ''}`}
    >
      {children}
    </div>
  );
};

// 3D Tilt Wrapper Component
const TiltWrapper = ({ children, intensity = 10 }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    const element = tiltRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * intensity;
      const rotateY = (centerX - x) / centerX * intensity;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div ref={tiltRef} className="tilt-wrapper">
      {children}
    </div>
  );
};

const professionalNotifications = [
  {
    id: 1,
    type: 'ai-insight',
    fileName: 'AI Analysis: Employee Handbook patterns detected',
    time: '30s ago',
    icon: Brain,
    category: 'AI Insights',
    priority: 'high',
    isAI: true
  },
  {
    id: 2,
    type: 'neural-update',
    fileName: 'Marketing Strategy v4.2 - Analysis Complete',
    time: '3m ago',
    icon: Network,
    category: 'Documents',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'data-sync',
    fileName: 'API Documentation updated successfully',
    time: '8m ago',
    icon: Database,
    category: 'Sync',
    priority: 'low'
  },
  {
    type: 'system-update',
    fileName: 'Design System Guidelines synchronized',
    time: '15m ago',
    icon: Settings,
    category: 'System',
    priority: 'low'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(professionalNotifications);
  const [unreadCount, setUnreadCount] = useState(3);
  const [recentFiles, setRecentFiles] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Fetch recent files from Google Drive
  const fetchRecentFiles = async () => {
    setIsLoadingRecent(true);
    try {
      // Hardcoded files from your Google Drive folder (sorted by date - oldest to newest)
      // Based on actual files in: https://drive.google.com/drive/folders/1zXkSacSoBdfbg0hm5ndXSkjyZO5tsqG6
      const actualDriveFiles = [
        {
          id: '1-Jv3wKP8J_rFC3PhUiAWf9bsVIQzwbpw',
          name: 'Terms_and_Conditions.pdf',
          mimeType: 'application/pdf',
          webViewLink: 'https://drive.google.com/file/d/1-Jv3wKP8J_rFC3PhUiAWf9bsVIQzwbpw/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
          createdTime: '2025-07-19T18:05:54.000Z',
          timeAgo: 'Jul 19, 2025'
        },
        {
          id: '1GnV1DuzoLNCrIBdRe7hDNJXNtKX8p1EB',
          name: 'Design_Brief_UIUX.txt',
          mimeType: 'text/plain',
          webViewLink: 'https://drive.google.com/file/d/1GnV1DuzoLNCrIBdRe7hDNJXNtKX8p1EB/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
          createdTime: '2025-07-19T18:05:54.000Z',
          timeAgo: 'Jul 19, 2025'
        },
        {
          id: '1KuwKDIVyY87zbfRgeJX4DK67mY0LIW51',
          name: 'refund_policy.txt',
          mimeType: 'text/plain',
          webViewLink: 'https://drive.google.com/file/d/1KuwKDIVyY87zbfRgeJX4DK67mY0LIW51/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/text/plain',
          createdTime: '2025-07-19T18:05:54.000Z',
          timeAgo: 'Jul 19, 2025'
        },
        // Sample Excel file for demonstration
        {
          id: 'sample-traindata-excel-id',
          name: 'traindata.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          webViewLink: 'https://drive.google.com/file/d/sample-traindata-excel-id/view',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          createdTime: '2025-07-20T10:00:00.000Z',
          timeAgo: 'Jul 20, 2025'
        }
      ];
      
      // Convert files to notification format
      const recentNotifications = actualDriveFiles.map((file, index) => ({
        id: `recent-${file.id}`,
        type: 'recent-access',
        fileName: file.name,
        time: file.timeAgo,
        icon: FileText,
        category: 'Recent Access',
        priority: index === 0 ? 'high' : 'medium',
        isAI: false,
        fileData: file
      }));
      
      // Combine recent files with existing notifications
      const combinedNotifications = [
        ...recentNotifications,
        ...professionalNotifications.filter(n => n.type !== 'recent-access')
      ];
      
      setNotifications(combinedNotifications);
      setRecentFiles(actualDriveFiles);
      setUnreadCount(recentNotifications.length + 1); // +1 for AI notification
      
      console.log(`Loaded ${actualDriveFiles.length} files from Google Drive`);
    } catch (error) {
      console.error('Error setting recent files:', error);
      // Keep default notifications if something fails
    } finally {
      setIsLoadingRecent(false);
    }
  };

  // Fetch recent files when component mounts and when notifications are opened
  useEffect(() => {
    fetchRecentFiles();
  }, []);

  useEffect(() => {
    if (showNotifications) {
      fetchRecentFiles(); // Refresh when opening notifications
    }
  }, [showNotifications]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  const handleThemeToggle = () => {
    if (!document.startViewTransition) {
      setDarkMode(!darkMode);
      return;
    }

    document.startViewTransition(() => {
      setDarkMode(!darkMode);
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
        variant: "default"
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      'ai-insight': '🧠',
      'neural-update': '🔗',
      'data-sync': '💾',
      'system-update': '⚙️',
      'recent-access': '👁️',
      'added': '✨',
      'updated': '🔄'
    };
    return iconMap[type] || '📄';
  };

  const getNotificationStyle = (priority: string, isAI: boolean = false, type: string = '') => {
    if (isAI) {
      return darkMode 
        ? 'border-l-accent-teal bg-gradient-to-r from-accent-teal/10 to-transparent ai-glow-dark'
        : 'border-l-accent-purple bg-gradient-to-r from-accent-purple/15 to-transparent ai-glow-light';
    }
    if (type === 'recent-access') {
      return darkMode 
        ? 'border-l-blue-400 bg-gradient-to-r from-blue-400/10 to-transparent recent-access-glow-dark'
        : 'border-l-blue-500 bg-gradient-to-r from-blue-500/15 to-transparent recent-access-glow-light';
    }
    const darkStyleMap = {
      'high': 'border-l-accent-orange bg-gradient-to-r from-accent-orange/10 to-transparent',
      'medium': 'border-l-accent-teal bg-gradient-to-r from-accent-teal/8 to-transparent',
      'low': 'border-l-neutral-400 bg-gradient-to-r from-neutral-400/5 to-transparent'
    };
    const lightStyleMap = {
      'high': 'border-l-accent-red bg-gradient-to-r from-accent-red/12 to-transparent',
      'medium': 'border-l-accent-blue bg-gradient-to-r from-accent-blue/10 to-transparent',
      'low': 'border-l-neutral-400 bg-gradient-to-r from-neutral-400/8 to-transparent'
    };
    return darkMode ? darkStyleMap[priority] || darkStyleMap['medium'] : lightStyleMap[priority] || lightStyleMap['medium'];
  };

  return (
    <div className={`relative min-h-screen font-professional overflow-hidden transition-all duration-1000 ${
      darkMode ? 'bg-dark-primary' : 'bg-light-primary'
    } animate-fade-in-smooth`}>
      
      {/* Magnetic Cursor */}
      <MagneticCursor />
      
      {/* Advanced Background Systems */}
      <FloatingGeometrySystem />
      
      {/* Subtle particle background */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="quantum-field">
          {Array.from({length: 20}).map((_, i) => (
            <div 
              key={i}
              className={`quantum-particle particle-variant-${(i % 4) + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Header with Staggered Animation */}
      <StaggeredElements delay={0}>
        <header className={`w-full border-b backdrop-blur-xl p-4 flex items-center justify-between shadow-professional animate-slide-down-smooth relative z-50 ${
          darkMode 
            ? 'border-dark-border bg-dark-glass' 
            : 'border-light-border bg-light-glass'
        }`}>
          <StaggeredElements delay={200}>
            <div className="flex items-center gap-4">
              <TiltWrapper intensity={8}>
                <div className={`logo-container animate-professional-pulse magnetic ${
                  darkMode ? 'bg-dark-accent-container' : 'bg-light-accent-container'
                }`}>
                  <Bot className={`w-8 h-8 ${darkMode ? 'text-accent-teal' : 'text-accent-purple'}`} />
                </div>
              </TiltWrapper>
              <div>
                <h1 className={`ml-2 font-bold text-3xl tracking-wide magnetic ${
                  darkMode ? 'professional-text-dark' : 'professional-text-light'
                }`}>
                  Fetchly AI
                </h1>
                <p className={`ml-2 text-sm font-mono ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  Neural Documentation Intelligence System
                </p>
              </div>
            </div>
          </StaggeredElements>
          
          <StaggeredElements delay={400}>
            <div className="flex items-center gap-6">
              {/* Status Indicators */}
              <div className={`status-panel ${
                darkMode ? 'bg-dark-glass' : 'bg-light-glass'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="status-indicator">
                    <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse-subtle" />
                    <span className={`text-xs font-mono ml-2 ${
                      darkMode ? 'text-neutral-300' : 'text-neutral-600'
                    }`}>
                      AI ACTIVE
                    </span>
                  </div>
                  <div className="status-indicator">
                    <div className={`w-2 h-2 rounded-full animate-pulse-subtle ${
                      darkMode ? 'bg-accent-orange' : 'bg-accent-blue'
                    }`} />
                    <span className={`text-xs font-mono ml-2 ${
                      darkMode ? 'text-neutral-300' : 'text-neutral-600'
                    }`}>
                      SYNCED
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <TiltWrapper intensity={6}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="professional-button p-3 rounded-xl hover:scale-105 transition-all duration-300 magnetic"
                  >
                    <Bell className={`w-6 h-6 ${darkMode ? 'text-neutral-300' : 'text-neutral-700'}`} />
                    {unreadCount > 0 && (
                      <span className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse-subtle professional-shadow ${
                        darkMode ? 'bg-accent-orange' : 'bg-accent-red'
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </TiltWrapper>

                {/* Professional Notification Panel */}
                {showNotifications && (
                  <div className={`fixed top-24 right-8 w-[420px] rounded-2xl border backdrop-blur-xl z-[9999] max-h-[600px] overflow-hidden notification-panel animate-slide-in-professional ${
                    darkMode 
                      ? 'bg-dark-glass border-dark-border professional-shadow-dark' 
                      : 'bg-light-glass border-light-border professional-shadow-light'
                  }`}>
                    <div className={`p-5 flex items-center justify-between ${
                      darkMode ? 'bg-dark-header' : 'bg-light-header'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Sparkles className={`w-5 h-5 ${darkMode ? 'text-accent-teal' : 'text-accent-purple'}`} />
                        <div>
                          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                            System Intelligence Feed
                          </h3>
                          <p className={`text-xs font-mono ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {isLoadingRecent ? 'Fetching recent files...' : `${recentFiles.length} recent files from Drive`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setUnreadCount(0)}
                          className={`text-xs font-mono px-3 py-1 rounded-lg transition-colors magnetic ${
                            darkMode 
                              ? 'text-accent-teal hover:text-accent-orange bg-accent-teal/10 hover:bg-accent-orange/10' 
                              : 'text-accent-purple hover:text-accent-blue bg-accent-purple/10 hover:bg-accent-blue/10'
                          }`}
                        >
                          Mark All Read
                        </button>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className={`transition-colors magnetic ${
                            darkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto professional-scrollbar">
                      {notifications.map((notification, index) => (
                        <StaggeredElements key={notification.id} delay={index * 100}>
                          <div
                            className={`notification-item p-4 border-l-4 transition-all duration-300 group cursor-pointer border-b ${
                              getNotificationStyle(notification.priority, notification.isAI, notification.type)
                            } ${
                              darkMode ? 'border-b-dark-border hover:bg-white/3' : 'border-b-light-border hover:bg-neutral-900/3'
                            }`}
                            onClick={() => {
                              if (notification.fileData?.webViewLink) {
                                window.open(notification.fileData.webViewLink, '_blank');
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <TiltWrapper intensity={4}>
                                  <div className="notification-professional-icon">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                      notification.isAI 
                                        ? darkMode ? 'ai-icon-container-dark' : 'ai-icon-container-light'
                                        : darkMode ? 'bg-dark-micro' : 'bg-light-micro'
                                    }`}>
                                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                    </div>
                                  </div>
                                </TiltWrapper>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    {notification.isAI && (
                                      <span className={`ai-badge ${darkMode ? 'ai-badge-dark' : 'ai-badge-light'}`}>
                                        AI
                                      </span>
                                    )}
                                    {notification.type === 'recent-access' && (
                                      <span className={`px-2 py-1 text-xs font-mono rounded-md ${
                                        darkMode 
                                          ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30' 
                                          : 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                                      }`}>
                                        RECENT
                                      </span>
                                    )}
                                    <p className={`font-medium text-sm transition-colors ${
                                      darkMode 
                                        ? 'text-white group-hover:text-accent-teal' 
                                        : 'text-neutral-900 group-hover:text-accent-purple'
                                    }`}>
                                      {notification.fileName}
                                    </p>
                                  </div>
                                  <div className={`flex items-center gap-2 text-xs ${
                                    darkMode ? 'text-neutral-400' : 'text-neutral-600'
                                  }`}>
                                    <Clock className="w-3 h-3" />
                                    <span>{notification.time}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className={`font-mono ${
                                      darkMode ? 'text-accent-orange' : 'text-accent-blue'
                                    }`}>
                                      {notification.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </StaggeredElements>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={handleThemeToggle}
                  className="professional-switch magnetic" 
                />
                <span className={`text-xs font-mono ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  {darkMode ? 'Professional Dark' : 'Clean Light'}
                </span>
              </div>
              
              <div className="flex gap-3 ml-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <button
                      className={`text-sm underline font-mono transition-colors magnetic ${
                        darkMode 
                          ? 'text-neutral-300 hover:text-accent-teal' 
                          : 'text-neutral-600 hover:text-accent-purple'
                      }`}
                      onClick={() => navigate('/profile')}
                    >
                      {user.email}
                    </button>
                        <Button className="professional-button-outline magnetic" onClick={handleLogout}>
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate('/signup')}
                      variant="outline"
                      size="sm"
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={() => navigate('/signin')}
                      variant="outline"
                      size="sm"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </StaggeredElements>
        </header>
      </StaggeredElements>

      {/* Main Content with Staggered Animations */}
      <main className="container mx-auto py-12 flex flex-col lg:flex-row gap-10 relative z-10 px-6">
        {/* Professional Sidebar */}
        <StaggeredElements delay={600}>
          <aside className="w-full lg:w-1/3 min-w-[320px] space-y-6">
            <TiltWrapper intensity={5}>
              <div className={`professional-card floating-professional-card p-6 magnetic ${
                darkMode ? 'border-dark-border' : 'border-light-border'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-dark-accent-container' : 'bg-light-accent-container'
                  }`}>
                    <Brain className={`w-6 h-6 ${darkMode ? 'text-accent-teal' : 'text-accent-purple'}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Intelligence Hub
                  </h3>
                </div>
                
                <div className="space-y-3 mb-8">
                  {notifications.slice(0, 3).map((notif, index) => (
                    <StaggeredElements key={index} delay={800 + (index * 100)}>
                      <div className={`notification-mini-professional flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer magnetic ${
                        darkMode ? 'bg-white/3 hover:bg-white/6' : 'bg-neutral-900/5 hover:bg-neutral-900/8'
                      }`}>
                        <span className="text-sm">{getNotificationIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs truncate ${
                            darkMode ? 'text-neutral-300' : 'text-neutral-700'
                          }`}>
                            {notif.fileName}
                          </p>
                          <p className={`text-xs font-mono ${
                            darkMode ? 'text-accent-orange' : 'text-accent-blue'
                          }`}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </StaggeredElements>
                  ))}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  <StaggeredElements delay={1200}>
                    <TiltWrapper intensity={8}>
                      <button
                        onClick={() => navigate("/notion")}
                        className={`professional-button-notion w-full py-4 font-bold tracking-wide rounded-xl transition-all duration-300 hover:scale-105 group magnetic`}
                      >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <FileText className="w-5 h-5" />
                          <span>Notion Hub</span>
                          <div className="professional-shine" />
                        </div>
                      </button>
                    </TiltWrapper>
                  </StaggeredElements>
                  
                  <StaggeredElements delay={1400}>
                    <TiltWrapper intensity={8}>
                      <button
                        onClick={() => navigate("/drive")}
                        className={`professional-button-drive w-full py-4 font-bold tracking-wide rounded-xl transition-all duration-300 hover:scale-105 group magnetic`}
                      >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <FolderOpen className="w-5 h-5" />
                          <span>Drive Matrix</span>
                          <div className="professional-shine" />
                        </div>
                      </button>
                    </TiltWrapper>
                  </StaggeredElements>
                </div>
              </div>
            </TiltWrapper>
          </aside>
        </StaggeredElements>

        {/* Main Chat Interface */}
        <StaggeredElements delay={800}>
          <section className="flex-1 relative">
            <TiltWrapper intensity={3}>
              <div className={`professional-card floating-professional-card2 p-8 min-h-[75vh] magnetic ${
                darkMode ? 'border-dark-border' : 'border-light-border'
              }`}>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-dark-accent-container' : 'bg-light-accent-container'
                    }`}>
                      <Sparkles className={`w-8 h-8 ${darkMode ? 'text-accent-teal' : 'text-accent-purple'}`} />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold mb-2 ${
                        darkMode ? 'professional-text-dark' : 'professional-text-light'
                      }`}>
                        AI Chat Interface
                      </h2>
                      <p className={`font-mono text-sm ${
                        darkMode ? 'text-neutral-300' : 'text-neutral-600'
                      }`}>
                        Ask anything about your team's documentation • Powered by AI
                      </p>
                    </div>
                  </div>
                </div>
                <Chat />
              </div>
            </TiltWrapper>
          </section>
        </StaggeredElements>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
