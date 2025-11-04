
// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// import './App.css';

// // API utility functions
// const api = {
//   baseURL: 'http://localhost:5000/api',
  
//   async request(endpoint, options = {}) {
//     const token = localStorage.getItem('token');
//     const config = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` })
//       },
//       ...options
//     };
    
//     if (config.body && typeof config.body === 'object') {
//       config.body = JSON.stringify(config.body);
//     }

//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, config);
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Request failed');
//       }
      
//       return data;
//     } catch (error) {
//       throw new Error(error.message || 'Network error');
//     }
//   },

//   auth: {
//     login: (email, password) => api.request('/auth/login', {
//       method: 'POST',
//       body: { email, password }
//     }),
//     register: (name, email, password) => api.request('/auth/register', {
//       method: 'POST',
//       body: { name, email, password }
//     })
//   },

//   jobs: {
//     getAll: () => api.request('/jobs'),
//     create: (formData) => {
//       const token = localStorage.getItem('token');
//       return fetch(`${api.baseURL}/jobs`, {
//         method: 'POST',
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` })
//         },
//         body: formData
//       }).then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to create job');
//         }
//         return response.json();
//       });
//     },
//     update: (id, formData) => {
//       const token = localStorage.getItem('token');
//       return fetch(`${api.baseURL}/jobs/${id}`, {
//         method: 'PUT',
//         headers: {
//           ...(token && { Authorization: `Bearer ${token}` })
//         },
//         body: formData
//       }).then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to update job');
//         }
//         return response.json();
//       });
//     },
//     delete: (id) => api.request(`/jobs/${id}`, { method: 'DELETE' })
//   },

//   notes: {
//     getAll: () => api.request('/notes'),
//     getByJob: (jobId) => api.request(`/notes/job/${jobId}`),
//     create: (noteData) => api.request('/notes', {
//       method: 'POST',
//       body: noteData
//     }),
//     update: (id, noteData) => api.request(`/notes/${id}`, {
//       method: 'PUT',
//       body: noteData
//     }),
//     delete: (id) => api.request(`/notes/${id}`, { method: 'DELETE' })
//   },

//   alerts: {
//     getAll: () => api.request('/alerts'),
//     create: (alertData) => api.request('/alerts', {
//       method: 'POST',
//       body: alertData
//     }),
//     update: (id, alertData) => api.request(`/alerts/${id}`, {
//       method: 'PUT',
//       body: alertData
//     }),
//     delete: (id) => api.request(`/alerts/${id}`, { method: 'DELETE' }),
//     toggleComplete: (id) => api.request(`/alerts/${id}/complete`, {
//       method: 'PATCH'
//     })
//   }
// };

// // Auth Context
// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const data = await api.auth.login(email, password);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       setUser(data.user);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   const register = async (name, email, password) => {
//     try {
//       await api.auth.register(name, email, password);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Simple Pie Chart Component
// const PieChart = ({ data, colors }) => {
//   const total = data.reduce((sum, item) => sum + item.value, 0);
  
//   if (total === 0) {
//     return (
//       <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//         No data to display
//       </div>
//     );
//   }

//   let currentAngle = 0;
//   const radius = 80;
//   const centerX = 100;
//   const centerY = 100;

//   const slices = data.map((item, index) => {
//     const percentage = (item.value / total) * 100;
//     const angle = (item.value / total) * 360;
//     const startAngle = currentAngle;
//     const endAngle = currentAngle + angle;
    
//     currentAngle = endAngle;

//     const startRad = (startAngle - 90) * (Math.PI / 180);
//     const endRad = (endAngle - 90) * (Math.PI / 180);

//     const x1 = centerX + radius * Math.cos(startRad);
//     const y1 = centerY + radius * Math.sin(startRad);
//     const x2 = centerX + radius * Math.cos(endRad);
//     const y2 = centerY + radius * Math.sin(endRad);

//     const largeArc = angle > 180 ? 1 : 0;

//     return {
//       path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
//       color: colors[index],
//       label: item.label,
//       value: item.value,
//       percentage: percentage.toFixed(1)
//     };
//   });

//   return (
//     <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
//       <svg width="200" height="200" viewBox="0 0 200 200">
//         {slices.map((slice, index) => (
//           <g key={index}>
//             <path d={slice.path} fill={slice.color} />
//           </g>
//         ))}
//       </svg>
//       <div style={{ flex: 1, minWidth: '200px' }}>
//         {slices.map((slice, index) => (
//           <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
//             <div style={{ width: '16px', height: '16px', backgroundColor: slice.color, borderRadius: '3px', marginRight: '8px' }}></div>
//             <span style={{ fontSize: '14px', color: '#333' }}>
//               {slice.label}: <strong>{slice.value}</strong> ({slice.percentage}%)
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Enhanced Sidebar Component with Mobile Menu
// const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [alertCount, setAlertCount] = useState(0);

//   // Fetch alert count on mount and every 5 minutes
//   useEffect(() => {
//     fetchAlertCount();
//     const interval = setInterval(fetchAlertCount, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchAlertCount = async () => {
//     try {
//       const alerts = await api.alerts.getAll();
//       const now = new Date();
      
//       const dueCount = alerts.filter(alert => {
//         const alertDate = new Date(alert.alertDate);
//         return alertDate <= now && !alert.isCompleted;
//       }).length;
      
//       setAlertCount(dueCount);
//     } catch (error) {
//       console.error('Error fetching alert count:', error);
//     }
//   };

//   const menuItems = [
//     { path: '/dashboard', icon: '📊', label: 'Dashboard' },
//     { path: '/applications', icon: '💼', label: 'My Applications' },
//     { path: '/notes', icon: '📝', label: 'Notes & Experience' },
//     { path: '/alerts', icon: '🔔', label: 'Alerts', badge: alertCount },
//   ];

//   // Close mobile menu when clicking a link
//   const handleLinkClick = () => {
//     if (window.innerWidth <= 768) {
//       setIsMobileMenuOpen(false);
//     }
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobileMenuOpen && (
//         <div 
//           className="mobile-overlay"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
      
//       <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
//         <div className="sidebar-header">
//           <h2>{!collapsed && 'Job Tracker'}</h2>
//           <button 
//             className="collapse-btn"
//             onClick={() => setCollapsed(!collapsed)}
//           >
//             {collapsed ? '→' : '←'}
//           </button>
//         </div>
        
//         <nav className="sidebar-nav">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
//               title={collapsed ? item.label : ''}
//               onClick={handleLinkClick}
//             >
//               <span className="nav-icon">{item.icon}</span>
//               {!collapsed && (
//                 <span className="nav-label">
//                   {item.label}
//                   {item.badge > 0 && (
//                     <span className="nav-badge">{item.badge}</span>
//                   )}
//                 </span>
//               )}
//               {collapsed && item.badge > 0 && (
//                 <span className="nav-badge-collapsed">{item.badge}</span>
//               )}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

// // Browser Notification Permission Component
// const NotificationPermission = () => {
//   const [permission, setPermission] = useState(Notification.permission);

//   useEffect(() => {
//     if (Notification.permission === 'default') {
//       requestPermission();
//     }
//   }, []);

//   const requestPermission = async () => {
//     const result = await Notification.requestPermission();
//     setPermission(result);
//   };

//   if (permission === 'granted') return null;
//   if (permission === 'denied') return null;

//   return (
//     <div className="notification-permission-popup">
//       <p>🔔 Enable notifications to get alert reminders!</p>
//       <button 
//         onClick={requestPermission}
//         className="primary-button"
//       >
//         Enable Notifications
//       </button>
//     </div>
//   );
// };

// // Alert Checker - Runs in background
// const AlertChecker = () => {
//   useEffect(() => {
//     checkAlerts();
//     const interval = setInterval(() => {
//       checkAlerts();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const checkAlerts = async () => {
//     try {
//       const alerts = await api.alerts.getAll();
//       const now = new Date();

//       const dueAlerts = alerts.filter(alert => {
//         if (alert.isCompleted) return false;
        
//         const alertTime = new Date(alert.alertDate);
//         const diffMs = alertTime - now;
//         const diffMinutes = diffMs / 60000;
        
//         return diffMinutes >= 0 && diffMinutes <= 1;
//       });

//       dueAlerts.forEach(alert => {
//         showBrowserNotification(alert);
//       });
//     } catch (error) {
//       console.error('Error checking alerts:', error);
//     }
//   };

//   const showBrowserNotification = (alert) => {
//     if (Notification.permission === 'granted') {
//       const notification = new Notification('🔔 Job Tracker Reminder', {
//         body: alert.title,
//         icon: '/favicon.ico',
//         tag: alert._id,
//         requireInteraction: true,
//       });

//       notification.onclick = () => {
//         window.focus();
//         window.location.href = '/alerts';
//         notification.close();
//       };

//       setTimeout(() => notification.close(), 10000);
//     }
//   };

//   return null;
// };

// // Login Component
// const LoginForm = ({ switchToRegister }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const result = await login(formData.email, formData.password);
    
//     if (!result.success) {
//       setError(result.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2 className="auth-title">Login to Job Tracker</h2>
//         {error && <div className="error-message">{error}</div>}
//         <div className="auth-form-container">
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//             className="form-input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({...formData, password: e.target.value})}
//             className="form-input"
//             required
//           />
//           <button 
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`primary-button ${loading ? 'disabled' : ''}`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </div>
//         <p className="switch-text">
//           Don't have an account? 
//           <span className="auth-link" onClick={switchToRegister}> Register here</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Register Component
// const RegisterForm = ({ switchToLogin }) => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     const result = await register(formData.name, formData.email, formData.password);
    
//     if (result.success) {
//       setSuccess('Account created successfully! Please login with your credentials.');
//       setFormData({ name: '', email: '', password: '' });
//       setTimeout(() => {
//         switchToLogin();
//       }, 2000);
//     } else {
//       setError(result.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2 className="auth-title">Create Account</h2>
//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}
//         <div className="auth-form-container">
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={(e) => setFormData({...formData, name: e.target.value})}
//             className="form-input"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//             className="form-input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({...formData, password: e.target.value})}
//             className="form-input"
//             required
//           />
//           <button 
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`primary-button ${loading ? 'disabled' : ''}`}
//           >
//             {loading ? 'Creating Account...' : 'Register'}
//           </button>
//         </div>
//         <p className="switch-text">
//           Already have an account? 
//           <span className="auth-link" onClick={switchToLogin}> Login here</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Job Form Component with Mobile Optimization
// const JobForm = ({ onJobAdded, editJob, onCancel }) => {
//   const [formData, setFormData] = useState({
//     company: '',
//     position: '',
//     status: 'applied',
//     skills: '',
//   });
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (editJob) {
//       setFormData({
//         company: editJob.company,
//         position: editJob.position,
//         status: editJob.status,
//         skills: editJob.skills ? editJob.skills.join(', ') : '',
//       });
//       setResumeFile(null);
//     }
//   }, [editJob]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'application/pdf') {
//         alert('Please select a PDF file only.');
//         e.target.value = '';
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB.');
//         e.target.value = '';
//         return;
//       }
//       setResumeFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);
    
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('company', formData.company);
//       formDataToSend.append('position', formData.position);
//       formDataToSend.append('status', formData.status);
//       formDataToSend.append('skills', formData.skills);
      
//       if (resumeFile) {
//         formDataToSend.append('resume', resumeFile);
//       }

//       if (editJob) {
//         await api.jobs.update(editJob._id, formDataToSend);
//       } else {
//         await api.jobs.create(formDataToSend);
//       }

//       setFormData({ company: '', position: '', status: 'applied', skills: '' });
//       setResumeFile(null);
//       onJobAdded();
//       if (onCancel) onCancel();
//     } catch (error) {
//       console.error('Error saving job:', error);
//       alert('Error saving job. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
//       <div className="job-form-modal">
//         <h3 className="form-title">{editJob ? 'Edit Job Application' : 'Add New Job Application'}</h3>
//         <div className="auth-form-container">
//           <input
//             type="text"
//             placeholder="Company Name"
//             value={formData.company}
//             onChange={(e) => setFormData({...formData, company: e.target.value})}
//             className="form-input"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Job Position"
//             value={formData.position}
//             onChange={(e) => setFormData({...formData, position: e.target.value})}
//             className="form-input"
//             required
//           />
//           <select
//             value={formData.status}
//             onChange={(e) => setFormData({...formData, status: e.target.value})}
//             className="form-select"
//           >
//             <option value="applied">Applied</option>
//             <option value="interview">Interview</option>
//             <option value="on hold">On Hold</option>
//             <option value="rejected">Rejected</option>
//             <option value="offer">Offer</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Skills (comma separated)"
//             value={formData.skills}
//             onChange={(e) => setFormData({...formData, skills: e.target.value})}
//             className="form-input"
//           />
          
//           <div className="file-upload-container">
//             <label className="file-label">
//               Upload Resume (PDF only, max 5MB):
//             </label>
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               className="file-input"
//             />
//             {resumeFile && (
//               <p className="file-name">Selected: {resumeFile.name}</p>
//             )}
//             {editJob && editJob.resume && !resumeFile && (
//               <p className="existing-file">
//                 Current resume: 
//                 <a 
//                   href={`http://localhost:5000${editJob.resume}`} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="resume-link"
//                 >
//                   View Resume
//                 </a>
//               </p>
//             )}
//           </div>
          
//           <div className="form-buttons">
//             <button 
//               onClick={handleSubmit} 
//               className={`primary-button ${uploading ? 'disabled' : ''}`}
//               disabled={uploading}
//             >
//               {uploading ? 'Uploading...' : (editJob ? 'Update' : 'Add')} Job
//             </button>
//             <button onClick={onCancel} className="secondary-button">Cancel</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Job Card Component
// const JobCard = ({ job, onEdit, onDelete, index, onDragStart, onDragOver, onDrop }) => {
//   const getStatusColor = (status) => {
//     const colors = {
//       applied: '#3498db',
//       interview: '#f39c12',
//       'on hold': '#95a5a6',
//       rejected: '#e74c3c',
//       offer: '#27ae60'
//     };
//     return colors[status] || '#333';
//   };

//   return (
//     <div 
//       className="job-card-compact"
//       draggable
//       onDragStart={(e) => onDragStart(e, index)}
//       onDragOver={(e) => onDragOver(e)}
//       onDrop={(e) => onDrop(e, index)}
//     >
//       <div className="job-drag-handle">⋮⋮</div>
//       <div className="job-header-compact">
//         <div className="job-info">
//           <h3 className="job-title-compact">{job.position}</h3>
//           <p className="company-compact">{job.company}</p>
//         </div>
//         <div className="job-actions-compact">
//           <span 
//             className="status-badge-compact" 
//             style={{backgroundColor: getStatusColor(job.status)}}
//           >
//             {job.status.toUpperCase()}
//           </span>
//         </div>
//       </div>
      
//       {job.skills && job.skills.length > 0 && (
//         <div className="skills-compact">
//           {job.skills.slice(0, 3).map((skill, index) => (
//             <span key={index} className="skill-tag-compact">{skill}</span>
//           ))}
//           {job.skills.length > 3 && <span className="skill-tag-compact">+{job.skills.length - 3}</span>}
//         </div>
//       )}
      
//       <div className="job-footer-compact">
//         <div className="job-meta">
//           <small className="job-date-compact">
//             {new Date(job.createdAt).toLocaleDateString()}
//           </small>
//           {job.resume && (
//             <a 
//               href={`http://localhost:5000${job.resume}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="resume-link-compact"
//             >
//               📄
//             </a>
//           )}
//         </div>
//         <div className="job-buttons">
//           <button onClick={() => onEdit(job)} className="edit-button-compact">Edit</button>
//           <button onClick={() => onDelete(job._id)} className="delete-button-compact">Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Pagination Component
// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pages = [];
//   const maxVisiblePages = 5;
  
//   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//   let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
//   if (endPage - startPage < maxVisiblePages - 1) {
//     startPage = Math.max(1, endPage - maxVisiblePages + 1);
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pages.push(i);
//   }

//   if (totalPages <= 1) return null;

//   return (
//     <div className="pagination">
//       <button 
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="pagination-button"
//       >
//         ‹
//       </button>
      
//       {startPage > 1 && (
//         <>
//           <button onClick={() => onPageChange(1)} className="pagination-button">1</button>
//           {startPage > 2 && <span className="pagination-ellipsis">...</span>}
//         </>
//       )}
      
//       {pages.map(page => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`pagination-button ${page === currentPage ? 'active' : ''}`}
//         >
//           {page}
//         </button>
//       ))}
      
//       {endPage < totalPages && (
//         <>
//           {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
//           <button onClick={() => onPageChange(totalPages)} className="pagination-button">{totalPages}</button>
//         </>
//       )}
      
//       <button 
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="pagination-button"
//       >
//         ›
//       </button>
//     </div>
//   );
// };

// // Enhanced Dashboard Page with Analytics
// const DashboardPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const data = await api.jobs.getAll();
//       setJobs(data);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     }
//   };

//   const getStatusCounts = () => {
//     const counts = {
//       applied: 0,
//       interview: 0,
//       'on hold': 0,
//       rejected: 0,
//       offer: 0
//     };
//     jobs.forEach(job => {
//       counts[job.status] = (counts[job.status] || 0) + 1;
//     });
//     return counts;
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       applied: '#3498db',
//       interview: '#f39c12',
//       'on hold': '#95a5a6',
//       rejected: '#e74c3c',
//       offer: '#27ae60'
//     };
//     return colors[status] || '#333';
//   };

//   const exportToCSV = () => {
//     if (jobs.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const headers = ['Company', 'Position', 'Status', 'Applied Date', 'Skills'];
//     const csvData = jobs.map(job => [
//       job.company,
//       job.position,
//       job.status,
//       new Date(job.createdAt).toLocaleDateString(),
//       job.skills ? job.skills.join(';') : ''
//     ]);

//     const csv = [
//       headers.join(','),
//       ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const statusCounts = getStatusCounts();
  
//   const chartData = Object.entries(statusCounts)
//     .filter(([_, value]) => value > 0)
//     .map(([label, value]) => ({
//       label: label.charAt(0).toUpperCase() + label.slice(1),
//       value
//     }));

//   const chartColors = ['#3498db', '#f39c12', '#95a5a6', '#e74c3c', '#27ae60'];

//   return (
//     <div className="page-content">
//       <div className="page-header-with-button">
//         <div>
//           <h1>Dashboard & Analytics</h1>
//           <p className="page-subtitle">Overview of your job applications with insights</p>
//         </div>
//         <button onClick={exportToCSV} className="export-button">
//           📥 Export to CSV
//         </button>
//       </div>

//       <div className="stats">
//         <div className="stat-card">
//           <h3 className="stat-title">Total Applications</h3>
//           <div className="stat-number">{jobs.length}</div>
//         </div>
//         {Object.entries(statusCounts).map(([status, count]) => (
//           <div key={status} className="stat-card">
//             <h3 className="stat-title" style={{color: getStatusColor(status)}}>
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </h3>
//             <div className="stat-number">{count}</div>
//           </div>
//         ))}
//       </div>

//       <div className="analytics-section">
//         <div className="analytics-card">
//           <h3>Application Status Distribution</h3>
//           <div className="chart-container">
//             {jobs.length > 0 ? (
//               <PieChart data={chartData} colors={chartColors} />
//             ) : (
//               <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
//                 No data available. Start adding job applications to see analytics!
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="analytics-card">
//           <h3>Key Metrics</h3>
//           <div className="metrics-grid">
//             <div className="metric-item">
//               <span className="metric-icon">🎯</span>
//               <div>
//                 <div className="metric-label">Success Rate</div>
//                 <div className="metric-value">
//                   {jobs.length > 0 ? Math.round((statusCounts.offer / jobs.length) * 100) : 0}%
//                 </div>
//               </div>
//             </div>
//             <div className="metric-item">
//               <span className="metric-icon">⏳</span>
//               <div>
//                 <div className="metric-label">Pending Responses</div>
//                 <div className="metric-value">
//                   {statusCounts.applied + statusCounts['on hold']}
//                 </div>
//               </div>
//             </div>
//             <div className="metric-item">
//               <span className="metric-icon">📝</span>
//               <div>
//                 <div className="metric-label">In Interview</div>
//                 <div className="metric-value">{statusCounts.interview}</div>
//               </div>
//             </div>
//             <div className="metric-item">
//               <span className="metric-icon">✅</span>
//               <div>
//                 <div className="metric-label">Offers Received</div>
//                 <div className="metric-value">{statusCounts.offer}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="dashboard-grid">
//         <div className="dashboard-card">
//           <h3>Recent Activity</h3>
//           <div className="recent-jobs">
//             {jobs.length === 0 ? (
//               <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
//                 No applications yet. Start adding jobs to see activity!
//               </p>
//             ) : (
//               jobs.slice(0, 5).map(job => (
//                 <div key={job._id} className="recent-job-item">
//                   <div>
//                     <strong>{job.position}</strong>
//                     <p>{job.company}</p>
//                   </div>
//                   <span className="status-mini" style={{backgroundColor: getStatusColor(job.status)}}>
//                     {job.status}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="dashboard-card">
//           <h3>Application Insights</h3>
//           <div className="insights-list">
//             <div className="insight-item">
//               <span className="insight-icon">📊</span>
//               <div>
//                 <div className="insight-label">Most Common Status</div>
//                 <div className="insight-value">
//                   {jobs.length > 0 
//                     ? Object.entries(statusCounts)
//                         .sort((a, b) => b[1] - a[1])[0][0]
//                         .charAt(0).toUpperCase() + Object.entries(statusCounts)
//                         .sort((a, b) => b[1] - a[1])[0][0].slice(1)
//                     : 'N/A'}
//                 </div>
//               </div>
//             </div>
//             <div className="insight-item">
//               <span className="insight-icon">🏢</span>
//               <div>
//                 <div className="insight-label">Total Companies</div>
//                 <div className="insight-value">
//                   {new Set(jobs.map(j => j.company)).size}
//                 </div>
//               </div>
//             </div>
//             <div className="insight-item">
//               <span className="insight-icon">⭐</span>
//               <div>
//                 <div className="insight-label">Response Rate</div>
//                 <div className="insight-value">
//                   {jobs.length > 0 
//                     ? Math.round(((statusCounts.interview + statusCounts.offer + statusCounts.rejected) / jobs.length * 100))
//                     : 0}%
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Applications Page
// const ApplicationsPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editJob, setEditJob] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [draggedItem, setDraggedItem] = useState(null);

//   const jobsPerPage = 10;
//   const totalPages = Math.ceil(jobs.length / jobsPerPage);
//   const startIndex = (currentPage - 1) * jobsPerPage;
//   const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

//   const fetchJobs = async () => {
//     try {
//       const data = await api.jobs.getAll();
//       setJobs(data);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const handleDelete = async (jobId) => {
//     if (window.confirm('Are you sure you want to delete this job application?')) {
//       try {
//         await api.jobs.delete(jobId);
//         fetchJobs();
//       } catch (error) {
//         console.error('Error deleting job:', error);
//       }
//     }
//   };

//   const handleDragStart = (e, index) => {
//     setDraggedItem(index);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e, dropIndex) => {
//     e.preventDefault();
    
//     if (draggedItem === null || draggedItem === dropIndex) return;

//     const updatedJobs = [...jobs];
//     const draggedJob = updatedJobs[draggedItem];
    
//     updatedJobs.splice(draggedItem, 1);
//     updatedJobs.splice(dropIndex, 0, draggedJob);
    
//     setJobs(updatedJobs);
//     setDraggedItem(null);
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="page-content">
//       <div className="page-header">
//         <h1>My Applications</h1>
//         <p className="page-subtitle">Manage all your job applications</p>
//       </div>

//       <div className="jobs-list-compact">
//         {jobs.length === 0 ? (
//           <div className="no-jobs">
//             <p>No job applications yet. Click the + button to add your first application!</p>
//           </div>
//         ) : (
//           paginatedJobs.map((job, index) => (
//             <JobCard
//               key={job._id}
//               job={job}
//               index={startIndex + index}
//               onEdit={setEditJob}
//               onDelete={handleDelete}
//               onDragStart={handleDragStart}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             />
//           ))
//         )}
//       </div>

//       <Pagination 
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />

//       <button 
//         className="floating-add-button"
//         onClick={() => setShowForm(true)}
//         title="Add New Job"
//       >
//         +
//       </button>

//       {(showForm || editJob) && (
//         <JobForm 
//           onJobAdded={() => {
//             fetchJobs();
//             setShowForm(false);
//             setEditJob(null);
//           }}
//           editJob={editJob}
//           onCancel={() => {
//             setShowForm(false);
//             setEditJob(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Notes Page Component
// const NotesPage = () => {
//   const [notes, setNotes] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editNote, setEditNote] = useState(null);
//   const [selectedJob, setSelectedJob] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchNotes();
//     fetchJobs();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       const data = await api.notes.getAll();
//       setNotes(data);
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const data = await api.jobs.getAll();
//       setJobs(data);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     }
//   };

//   const handleDelete = async (noteId) => {
//     if (window.confirm('Are you sure you want to delete this note?')) {
//       try {
//         await api.notes.delete(noteId);
//         fetchNotes();
//       } catch (error) {
//         console.error('Error deleting note:', error);
//       }
//     }
//   };

//   const getInterviewTypeIcon = (type) => {
//     const icons = {
//       'Phone Screen': '📞',
//       'Technical': '💻',
//       'System Design': '🏗️',
//       'Behavioral': '🗣️',
//       'HR': '👔',
//       'On-site': '🏢',
//       'General': '📝'
//     };
//     return icons[type] || '📝';
//   };

//   const filteredNotes = notes.filter(note => {
//     const matchesJob = selectedJob === 'all' || note.jobId === selectedJob;
//     const matchesSearch = note.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          note.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesJob && matchesSearch;
//   });

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="page-content">
//       <div className="page-header-with-button">
//         <div>
//           <h1>Notes & Experience</h1>
//           <p className="page-subtitle">Track your interview experiences and preparation notes</p>
//         </div>
//         <button onClick={() => setShowForm(true)} className="primary-button">
//           ➕ Add Note
//         </button>
//       </div>

//       <div className="notes-filters">
//         <input
//           type="text"
//           placeholder="Search notes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="form-input"
//         />
//         <select
//           value={selectedJob}
//           onChange={(e) => setSelectedJob(e.target.value)}
//           className="form-select"
//         >
//           <option value="all">All Companies</option>
//           {jobs.map(job => (
//             <option key={job._id} value={job._id}>
//               {job.company} - {job.position}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="notes-stats">
//         <div className="stat-card">
//           <h3 className="stat-title">Total Notes</h3>
//           <div className="stat-number">{notes.length}</div>
//         </div>
//         <div className="stat-card">
//           <h3 className="stat-title">Companies Tracked</h3>
//           <div className="stat-number">
//             {new Set(notes.map(n => n.company)).size}
//           </div>
//         </div>
//         <div className="stat-card">
//           <h3 className="stat-title">Avg Rating</h3>
//           <div className="stat-number">
//             {notes.length > 0
//               ? (notes.reduce((sum, n) => sum + (n.rating || 0), 0) / notes.filter(n => n.rating).length).toFixed(1)
//               : 'N/A'}
//           </div>
//         </div>
//       </div>

//       <div className="notes-timeline">
//         {filteredNotes.length === 0 ? (
//           <div className="no-jobs">
//             <p>No notes found. Start adding interview experiences!</p>
//           </div>
//         ) : (
//           filteredNotes.map(note => (
//             <div key={note._id} className="note-card">
//               <div className="note-header">
//                 <div className="note-title-section">
//                   <span className="note-icon">{getInterviewTypeIcon(note.interviewType)}</span>
//                   <div>
//                     <h3 className="note-title">{note.company}</h3>
//                     <p className="note-subtitle">{note.position} • {note.interviewType} • {note.round}</p>
//                   </div>
//                 </div>
//                 <div className="note-actions">
//                   {note.rating && (
//                     <div className="note-rating">
//                       {'⭐'.repeat(note.rating)}
//                     </div>
//                   )}
//                   <button onClick={() => setEditNote(note)} className="edit-button-compact">Edit</button>
//                   <button onClick={() => handleDelete(note._id)} className="delete-button-compact">Delete</button>
//                 </div>
//               </div>

//               {note.interviewDate && (
//                 <div className="note-date">
//                   📅 {new Date(note.interviewDate).toLocaleDateString('en-US', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                 </div>
//               )}

//               <div className="note-content">
//                 <h4>Interview Notes:</h4>
//                 <p>{note.content}</p>
//               </div>

//               {note.questionsAsked && note.questionsAsked.length > 0 && (
//                 <div className="note-section">
//                   <h4>Questions Asked:</h4>
//                   <ul className="questions-list">
//                     {note.questionsAsked.map((q, idx) => (
//                       <li key={idx}>{q}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {note.learnings && (
//                 <div className="note-section">
//                   <h4>✅ What Went Well:</h4>
//                   <p>{note.learnings}</p>
//                 </div>
//               )}

//               {note.improvements && (
//                 <div className="note-section">
//                   <h4>📈 Areas for Improvement:</h4>
//                   <p>{note.improvements}</p>
//                 </div>
//               )}

//               <div className="note-footer">
//                 <small>Created {new Date(note.createdAt).toLocaleDateString()}</small>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {(showForm || editNote) && (
//         <NoteForm
//           jobs={jobs}
//           onNoteSaved={() => {
//             fetchNotes();
//             setShowForm(false);
//             setEditNote(null);
//           }}
//           editNote={editNote}
//           onCancel={() => {
//             setShowForm(false);
//             setEditNote(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Note Form Component
// const NoteForm = ({ jobs, onNoteSaved, editNote, onCancel }) => {
//   const [formData, setFormData] = useState({
//     jobId: '',
//     company: '',
//     position: '',
//     interviewType: 'General',
//     round: 'Round 1',
//     interviewDate: '',
//     rating: 3,
//     questionsAsked: '',
//     content: '',
//     learnings: '',
//     improvements: '',
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editNote) {
//       setFormData({
//         ...editNote,
//         questionsAsked: editNote.questionsAsked ? editNote.questionsAsked.join('\n') : '',
//         interviewDate: editNote.interviewDate ? new Date(editNote.interviewDate).toISOString().split('T')[0] : '',
//       });
//     }
//   }, [editNote]);

//   const handleJobSelect = (e) => {
//     const jobId = e.target.value;
//     const selectedJob = jobs.find(j => j._id === jobId);
    
//     if (selectedJob) {
//       setFormData({
//         ...formData,
//         jobId,
//         company: selectedJob.company,
//         position: selectedJob.position,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const noteData = {
//         ...formData,
//         questionsAsked: formData.questionsAsked.split('\n').filter(q => q.trim()),
//       };

//       if (editNote) {
//         await api.notes.update(editNote._id, noteData);
//       } else {
//         await api.notes.create(noteData);
//       }

//       onNoteSaved();
//     } catch (error) {
//       console.error('Error saving note:', error);
//       alert('Error saving note. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
//       <div className="note-form-modal">
//         <h3 className="form-title">{editNote ? 'Edit Note' : 'Add Interview Note'}</h3>
//         <form onSubmit={handleSubmit} className="auth-form-container">
//           <select
//             value={formData.jobId}
//             onChange={handleJobSelect}
//             className="form-select"
//             required
//           >
//             <option value="">Select Job Application</option>
//             {jobs.map(job => (
//               <option key={job._id} value={job._id}>
//                 {job.company} - {job.position}
//               </option>
//             ))}
//           </select>

//           <div className="form-row-2col">
//             <select
//               value={formData.interviewType}
//               onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
//               className="form-select"
//             >
//               <option value="General">General</option>
//               <option value="Phone Screen">Phone Screen</option>
//               <option value="Technical">Technical</option>
//               <option value="System Design">System Design</option>
//               <option value="Behavioral">Behavioral</option>
//               <option value="HR">HR</option>
//               <option value="On-site">On-site</option>
//             </select>

//             <input
//               type="text"
//               placeholder="Round (e.g., Round 1)"
//               value={formData.round}
//               onChange={(e) => setFormData({...formData, round: e.target.value})}
//               className="form-input"
//             />
//           </div>

//           <input
//             type="date"
//             value={formData.interviewDate}
//             onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
//             className="form-input"
//           />

//           <div>
//             <label className="file-label">Rating: {formData.rating} ⭐</label>
//             <input
//               type="range"
//               min="1"
//               max="5"
//               value={formData.rating}
//               onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
//               className="rating-slider"
//             />
//           </div>

//           <textarea
//             placeholder="Interview Notes (required)"
//             value={formData.content}
//             onChange={(e) => setFormData({...formData, content: e.target.value})}
//             className="form-textarea"
//             rows="4"
//             required
//           />

//           <textarea
//             placeholder="Questions Asked (one per line)"
//             value={formData.questionsAsked}
//             onChange={(e) => setFormData({...formData, questionsAsked: e.target.value})}
//             className="form-textarea"
//             rows="3"
//           />

//           <textarea
//             placeholder="What Went Well / Learnings"
//             value={formData.learnings}
//             onChange={(e) => setFormData({...formData, learnings: e.target.value})}
//             className="form-textarea"
//             rows="3"
//           />

//           <textarea
//             placeholder="Areas for Improvement"
//             value={formData.improvements}
//             onChange={(e) => setFormData({...formData, improvements: e.target.value})}
//             className="form-textarea"
//             rows="3"
//           />

//           <div className="form-buttons">
//             <button 
//               type="submit" 
//               className={`primary-button ${saving ? 'disabled' : ''}`}
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : (editNote ? 'Update Note' : 'Save Note')}
//             </button>
//             <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Complete Alerts Page Component
// const AlertsPage = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editAlert, setEditAlert] = useState(null);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     fetchAlerts();
//     fetchJobs();
//   }, []);

//   const fetchAlerts = async () => {
//     try {
//       const data = await api.alerts.getAll();
//       setAlerts(data);
//     } catch (error) {
//       console.error('Error fetching alerts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const data = await api.jobs.getAll();
//       setJobs(data);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     }
//   };

//   const handleDelete = async (alertId) => {
//     if (window.confirm('Are you sure you want to delete this alert?')) {
//       try {
//         await api.alerts.delete(alertId);
//         fetchAlerts();
//       } catch (error) {
//         console.error('Error deleting alert:', error);
//       }
//     }
//   };

//   const handleToggleComplete = async (alertId) => {
//     try {
//       await api.alerts.toggleComplete(alertId);
//       fetchAlerts();
//     } catch (error) {
//       console.error('Error updating alert:', error);
//     }
//   };

//   const getAlertTypeIcon = (type) => {
//     const icons = {
//       'follow-up': '📧',
//       'interview-prep': '📝',
//       'deadline': '⏰',
//       'thank-you': '💌',
//       'custom': '🔔'
//     };
//     return icons[type] || '🔔';
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       high: '#e74c3c',
//       medium: '#f39c12',
//       low: '#3498db'
//     };
//     return colors[priority] || '#95a5a6';
//   };

//   const isOverdue = (date) => {
//     return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
//   };

//   const isToday = (date) => {
//     return new Date(date).toDateString() === new Date().toDateString();
//   };

//   const getFilteredAlerts = () => {
//     const now = new Date();
    
//     return alerts.filter(alert => {
//       const alertDate = new Date(alert.alertDate);
      
//       switch(filter) {
//         case 'today':
//           return isToday(alertDate) && !alert.isCompleted;
//         case 'upcoming':
//           return alertDate > now && !alert.isCompleted;
//         case 'overdue':
//           return isOverdue(alertDate) && !alert.isCompleted;
//         case 'completed':
//           return alert.isCompleted;
//         default:
//           return true;
//       }
//     });
//   };

//   const filteredAlerts = getFilteredAlerts();

//   const stats = {
//     total: alerts.length,
//     today: alerts.filter(a => isToday(a.alertDate) && !a.isCompleted).length,
//     overdue: alerts.filter(a => isOverdue(a.alertDate) && !a.isCompleted).length,
//     completed: alerts.filter(a => a.isCompleted).length
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="page-content">
//       <div className="page-header-with-button">
//         <div>
//           <h1>Alerts & Reminders</h1>
//           <p className="page-subtitle">Stay on top of deadlines and follow-ups</p>
//         </div>
//         <button onClick={() => setShowForm(true)} className="primary-button">
//           ➕ Add Alert
//         </button>
//       </div>

//       <div className="notes-stats">
//         <div className="stat-card">
//           <h3 className="stat-title">Total Alerts</h3>
//           <div className="stat-number">{stats.total}</div>
//         </div>
//         <div className="stat-card">
//           <h3 className="stat-title" style={{color: '#f39c12'}}>Due Today</h3>
//           <div className="stat-number">{stats.today}</div>
//         </div>
//         <div className="stat-card">
//           <h3 className="stat-title" style={{color: '#e74c3c'}}>Overdue</h3>
//           <div className="stat-number">{stats.overdue}</div>
//         </div>
//         <div className="stat-card">
//           <h3 className="stat-title" style={{color: '#27ae60'}}>Completed</h3>
//           <div className="stat-number">{stats.completed}</div>
//         </div>
//       </div>

//       <div className="alert-filters">
//         <button 
//           className={`filter-button ${filter === 'all' ? 'active' : ''}`}
//           onClick={() => setFilter('all')}
//         >
//           All
//         </button>
//         <button 
//           className={`filter-button ${filter === 'today' ? 'active' : ''}`}
//           onClick={() => setFilter('today')}
//         >
//           Today
//         </button>
//         <button 
//           className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
//           onClick={() => setFilter('upcoming')}
//         >
//           Upcoming
//         </button>
//         <button 
//           className={`filter-button ${filter === 'overdue' ? 'active' : ''}`}
//           onClick={() => setFilter('overdue')}
//         >
//           Overdue
//         </button>
//         <button 
//           className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
//           onClick={() => setFilter('completed')}
//         >
//           Completed
//         </button>
//       </div>

//       <div className="alerts-list">
//         {filteredAlerts.length === 0 ? (
//           <div className="no-jobs">
//             <p>No alerts found. Create your first reminder!</p>
//           </div>
//         ) : (
//           filteredAlerts.map(alert => (
//             <div 
//               key={alert._id} 
//               className={`alert-card ${alert.isCompleted ? 'completed' : ''} ${isOverdue(alert.alertDate) && !alert.isCompleted ? 'overdue' : ''} ${isToday(alert.alertDate) && !alert.isCompleted ? 'today' : ''}`}
//             >
//               <div className="alert-header">
//                 <div className="alert-title-section">
//                   <input
//                     type="checkbox"
//                     checked={alert.isCompleted}
//                     onChange={() => handleToggleComplete(alert._id)}
//                     className="alert-checkbox"
//                   />
//                   <span className="alert-type-icon">{getAlertTypeIcon(alert.type)}</span>
//                   <div>
//                     <h3 className="alert-title">{alert.title}</h3>
//                     {alert.jobId && (
//                       <p className="alert-job">
//                         {alert.jobId.company} - {alert.jobId.position}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="alert-actions">
//                   <span 
//                     className="priority-badge"
//                     style={{backgroundColor: getPriorityColor(alert.priority)}}
//                   >
//                     {alert.priority.toUpperCase()}
//                   </span>
//                   <button onClick={() => setEditAlert(alert)} className="edit-button-compact">Edit</button>
//                   <button onClick={() => handleDelete(alert._id)} className="delete-button-compact">Delete</button>
//                 </div>
//               </div>

//               {alert.description && (
//                 <p className="alert-description">{alert.description}</p>
//               )}

//               <div className="alert-footer">
//                 <span className="alert-date">
//                   📅 {new Date(alert.alertDate).toLocaleDateString('en-US', {
//                     weekday: 'short',
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric'
//                   })}
//                   {' at '}
//                   ⏰ {new Date(alert.alertDate).toLocaleTimeString('en-US', {
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                   {isOverdue(alert.alertDate) && !alert.isCompleted && (
//                     <span className="overdue-badge"> • OVERDUE</span>
//                   )}
//                   {isToday(alert.alertDate) && !alert.isCompleted && (
//                     <span className="today-badge"> • TODAY</span>
//                   )}
//                 </span>
//                 <span className="alert-type">{alert.type.replace('-', ' ').toUpperCase()}</span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {(showForm || editAlert) && (
//         <AlertForm
//           jobs={jobs}
//           onAlertSaved={() => {
//             fetchAlerts();
//             setShowForm(false);
//             setEditAlert(null);
//           }}
//           editAlert={editAlert}
//           onCancel={() => {
//             setShowForm(false);
//             setEditAlert(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Alert Form Component
// const AlertForm = ({ jobs, onAlertSaved, editAlert, onCancel }) => {
//   const [formData, setFormData] = useState({
//     jobId: '',
//     type: 'custom',
//     title: '',
//     description: '',
//     alertDate: '',
//     alertTime: '09:00',
//     priority: 'medium',
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editAlert) {
//       const alertDateTime = new Date(editAlert.alertDate);
//       const dateStr = alertDateTime.toISOString().split('T')[0];
//       const timeStr = alertDateTime.toTimeString().slice(0, 5);
      
//       setFormData({
//         jobId: editAlert.jobId?._id || '',
//         type: editAlert.type,
//         title: editAlert.title,
//         description: editAlert.description || '',
//         alertDate: dateStr,
//         alertTime: timeStr,
//         priority: editAlert.priority,
//       });
//     }
//   }, [editAlert]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const dateTimeString = `${formData.alertDate}T${formData.alertTime}:00`;
//       const alertDateTime = new Date(dateTimeString);

//       const alertData = {
//         jobId: formData.jobId || null,
//         type: formData.type,
//         title: formData.title,
//         description: formData.description,
//         alertDate: alertDateTime.toISOString(),
//         priority: formData.priority,
//       };

//       if (editAlert) {
//         await api.alerts.update(editAlert._id, alertData);
//       } else {
//         await api.alerts.create(alertData);
//       }

//       onAlertSaved();
//     } catch (error) {
//       console.error('Error saving alert:', error);
//       alert('Error saving alert. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
//       <div className="note-form-modal">
//         <h3 className="form-title">{editAlert ? 'Edit Alert' : 'Add New Alert'}</h3>
//         <form onSubmit={handleSubmit} className="auth-form-container">
//           <input
//             type="text"
//             placeholder="Alert Title (required)"
//             value={formData.title}
//             onChange={(e) => setFormData({...formData, title: e.target.value})}
//             className="form-input"
//             required
//           />

//           <select
//             value={formData.type}
//             onChange={(e) => setFormData({...formData, type: e.target.value})}
//             className="form-select"
//           >
//             <option value="custom">Custom Reminder</option>
//             <option value="follow-up">Follow-up</option>
//             <option value="interview-prep">Interview Preparation</option>
//             <option value="deadline">Application Deadline</option>
//             <option value="thank-you">Send Thank You Email</option>
//           </select>

//           <select
//             value={formData.jobId}
//             onChange={(e) => setFormData({...formData, jobId: e.target.value})}
//             className="form-select"
//           >
//             <option value="">General Reminder (No Job)</option>
//             {jobs.map(job => (
//               <option key={job._id} value={job._id}>
//                 {job.company} - {job.position}
//               </option>
//             ))}
//           </select>

//           <textarea
//             placeholder="Description (optional)"
//             value={formData.description}
//             onChange={(e) => setFormData({...formData, description: e.target.value})}
//             className="form-textarea"
//             rows="3"
//           />

//           <div className="form-row-2col">
//             <div>
//               <label className="file-label">Date</label>
//               <input
//                 type="date"
//                 value={formData.alertDate}
//                 onChange={(e) => setFormData({...formData, alertDate: e.target.value})}
//                 className="form-input"
//                 required
//               />
//             </div>
//             <div>
//               <label className="file-label">Time</label>
//               <input
//                 type="time"
//                 value={formData.alertTime}
//                 onChange={(e) => setFormData({...formData, alertTime: e.target.value})}
//                 className="form-input"
//                 required
//               />
//             </div>
//           </div>

//           <select
//             value={formData.priority}
//             onChange={(e) => setFormData({...formData, priority: e.target.value})}
//             className="form-select"
//           >
//             <option value="low">Low Priority</option>
//             <option value="medium">Medium Priority</option>
//             <option value="high">High Priority</option>
//           </select>

//           <div className="form-buttons">
//             <button 
//               type="submit" 
//               className={`primary-button ${saving ? 'disabled' : ''}`}
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : (editAlert ? 'Update Alert' : 'Create Alert')}
//             </button>
//             <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };


// const ProfilePage = () => {
//   const { user, updateUser } = useAuth();
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name,
//         email: user.email
//       });
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await api.profile.update(formData.name, formData.email);
//       updateUser(response.user);
//       setMessage({ type: 'success', text: 'Profile updated successfully!' });
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-content">
//       <div className="page-header">
//         <h1>My Profile</h1>
//         <p className="page-subtitle">Update your account information</p>
//       </div>

//       {message.text && (
//         <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
//           {message.text}
//         </div>
//       )}

//       <div className="profile-card-simple">
//         <h3>Profile Information</h3>
//         <form onSubmit={handleSubmit} className="auth-form-container">
//           <div>
//             <label className="file-label">Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="form-input"
//               required
//             />
//           </div>

//           <div>
//             <label className="file-label">Email</label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//               className="form-input"
//               required
//             />
//           </div>

//           <div className="profile-info-box">
//             <p><strong>User ID:</strong> {user?._id}</p>
//             <p><strong>Account Created:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
//           </div>

//           <button
//             type="submit"
//             className="primary-button"
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : '💾 Save Changes'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };





// // Main Layout with Mobile Menu State
// const MainLayout = () => {
//   const { user, logout } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div className="main-layout">
//       <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
//       <div className="main-content">
//         <header className="top-header">
//           <div className="header-content">
//             <div className="header-left">
//               <button 
//                 className="mobile-menu-toggle"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 aria-label="Toggle menu"
//               >
//                 ☰
//               </button>
//               <h1 className="app-title">Job Application Tracker</h1>
//             </div>
//             <div className="user-section">
//               <span className="welcome-text">Welcome, {user.name}!</span>
//               <button onClick={logout} className="logout-button">Logout</button>
//             </div>
//           </div>
//         </header>
        
//         <div className="content-wrapper">
//           <Routes>
//             <Route path="/" element={<DashboardPage />} />
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="/applications" element={<ApplicationsPage />} />
//             <Route path="/notes" element={<NotesPage />} />
//             <Route path="/alerts" element={<AlertsPage />} />
//           </Routes>
//         </div>
//       </div>
      
//       <NotificationPermission />
//       <AlertChecker />
//     </div>
//   );
// };

// // Auth Page
// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);

//   return isLogin ? (
//     <LoginForm switchToRegister={() => setIsLogin(false)} />
//   ) : (
//     <RegisterForm switchToLogin={() => setIsLogin(true)} />
//   );
// };

// // Main App
// const App = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return user ? (
//     <Router>
//       <MainLayout />
//     </Router>
//   ) : (
//     <AuthPage />
//   );
// };

// // App with Provider
// export default function AppWithProvider() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }






















import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// API utility functions
const api = {
  baseURL: 'http://localhost:5000/api',
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };
    
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  },

  auth: {
    login: (email, password) => api.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),
    register: (name, email, password) => api.request('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    })
  },

  jobs: {
    getAll: () => api.request('/jobs'),
    create: (formData) => {
      const token = localStorage.getItem('token');
      return fetch(`${api.baseURL}/jobs`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to create job');
        }
        return response.json();
      });
    },
    update: (id, formData) => {
      const token = localStorage.getItem('token');
      return fetch(`${api.baseURL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update job');
        }
        return response.json();
      });
    },
    delete: (id) => api.request(`/jobs/${id}`, { method: 'DELETE' })
  },

  notes: {
    getAll: () => api.request('/notes'),
    getByJob: (jobId) => api.request(`/notes/job/${jobId}`),
    create: (noteData) => api.request('/notes', {
      method: 'POST',
      body: noteData
    }),
    update: (id, noteData) => api.request(`/notes/${id}`, {
      method: 'PUT',
      body: noteData
    }),
    delete: (id) => api.request(`/notes/${id}`, { method: 'DELETE' })
  },

  alerts: {
    getAll: () => api.request('/alerts'),
    create: (alertData) => api.request('/alerts', {
      method: 'POST',
      body: alertData
    }),
    update: (id, alertData) => api.request(`/alerts/${id}`, {
      method: 'PUT',
      body: alertData
    }),
    delete: (id) => api.request(`/alerts/${id}`, { method: 'DELETE' }),
    toggleComplete: (id) => api.request(`/alerts/${id}/complete`, {
      method: 'PATCH'
    })
  },

  // NEW: Profile API
  profile: {
    get: () => api.request('/profile'),
    update: (name, email) => api.request('/profile', {
      method: 'PUT',
      body: { name, email }
    })
  }
};

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.auth.register(name, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // NEW: Add updateUser function
  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple Pie Chart Component
const PieChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        No data to display
      </div>
    );
  }

  let currentAngle = 0;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      path: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[index],
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {slices.map((slice, index) => (
          <g key={index}>
            <path d={slice.path} fill={slice.color} />
          </g>
        ))}
      </svg>
      <div style={{ flex: 1, minWidth: '200px' }}>
        {slices.map((slice, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: slice.color, borderRadius: '3px', marginRight: '8px' }}></div>
            <span style={{ fontSize: '14px', color: '#333' }}>
              {slice.label}: <strong>{slice.value}</strong> ({slice.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Sidebar Component with Mobile Menu
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  // Fetch alert count on mount and every 5 minutes
  useEffect(() => {
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertCount = async () => {
    try {
      const alerts = await api.alerts.getAll();
      const now = new Date();
      
      const dueCount = alerts.filter(alert => {
        const alertDate = new Date(alert.alertDate);
        return alertDate <= now && !alert.isCompleted;
      }).length;
      
      setAlertCount(dueCount);
    } catch (error) {
      console.error('Error fetching alert count:', error);
    }
  };

  // UPDATED: Add Profile to menu items
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/applications', icon: '💼', label: 'My Applications' },
    { path: '/notes', icon: '📝', label: 'Notes & Experience' },
    { path: '/alerts', icon: '🔔', label: 'Alerts', badge: alertCount },
    { path: '/profile', icon: '👤', label: 'Profile' }, // NEW LINE
  ];

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>{!collapsed && 'Job Tracker'}</h2>
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
              onClick={handleLinkClick}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && (
                <span className="nav-label">
                  {item.label}
                  {item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </span>
              )}
              {collapsed && item.badge > 0 && (
                <span className="nav-badge-collapsed">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

// Browser Notification Permission Component
const NotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission === 'default') {
      requestPermission();
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (permission === 'granted') return null;
  if (permission === 'denied') return null;

  return (
    <div className="notification-permission-popup">
      <p>🔔 Enable notifications to get alert reminders!</p>
      <button 
        onClick={requestPermission}
        className="primary-button"
      >
        Enable Notifications
      </button>
    </div>
  );
};

// Alert Checker - Runs in background
const AlertChecker = () => {
  useEffect(() => {
    checkAlerts();
    const interval = setInterval(() => {
      checkAlerts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkAlerts = async () => {
    try {
      const alerts = await api.alerts.getAll();
      const now = new Date();

      const dueAlerts = alerts.filter(alert => {
        if (alert.isCompleted) return false;
        
        const alertTime = new Date(alert.alertDate);
        const diffMs = alertTime - now;
        const diffMinutes = diffMs / 60000;
        
        return diffMinutes >= 0 && diffMinutes <= 1;
      });

      dueAlerts.forEach(alert => {
        showBrowserNotification(alert);
      });
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  };

  const showBrowserNotification = (alert) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('🔔 Job Tracker Reminder', {
        body: alert.title,
        icon: '/favicon.ico',
        tag: alert._id,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/alerts';
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);
    }
  };

  return null;
};

// Login Component
const LoginForm = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Login to Job Tracker</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="auth-form-container">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="form-input"
            required
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`primary-button ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p className="switch-text">
          Don't have an account? 
          <span className="auth-link" onClick={switchToRegister}> Register here</span>
        </p>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      setSuccess('Account created successfully! Please login with your credentials.');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => {
        switchToLogin();
      }, 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="auth-form-container">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="form-input"
            required
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`primary-button ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
        <p className="switch-text">
          Already have an account? 
          <span className="auth-link" onClick={switchToLogin}> Login here</span>
        </p>
      </div>
    </div>
  );
};

// Job Form Component with Mobile Optimization
const JobForm = ({ onJobAdded, editJob, onCancel }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    skills: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editJob) {
      setFormData({
        company: editJob.company,
        position: editJob.position,
        status: editJob.status,
        skills: editJob.skills ? editJob.skills.join(', ') : '',
      });
      setResumeFile(null);
    }
  }, [editJob]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only.');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        e.target.value = '';
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('company', formData.company);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('skills', formData.skills);
      
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      if (editJob) {
        await api.jobs.update(editJob._id, formDataToSend);
      } else {
        await api.jobs.create(formDataToSend);
      }

      setFormData({ company: '', position: '', status: 'applied', skills: '' });
      setResumeFile(null);
      onJobAdded();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
      <div className="job-form-modal">
        <h3 className="form-title">{editJob ? 'Edit Job Application' : 'Add New Job Application'}</h3>
        <div className="auth-form-container">
          <input
            type="text"
            placeholder="Company Name"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Job Position"
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="form-input"
            required
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="form-select"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="on hold">On Hold</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
          </select>
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            className="form-input"
          />
          
          <div className="file-upload-container">
            <label className="file-label">
              Upload Resume (PDF only, max 5MB):
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            {resumeFile && (
              <p className="file-name">Selected: {resumeFile.name}</p>
            )}
            {editJob && editJob.resume && !resumeFile && (
              <p className="existing-file">
                Current resume: 
                <a 
                  href={`http://localhost:5000${editJob.resume}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  View Resume
                </a>
              </p>
            )}
          </div>
          
          <div className="form-buttons">
            <button 
              onClick={handleSubmit} 
              className={`primary-button ${uploading ? 'disabled' : ''}`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : (editJob ? 'Update' : 'Add')} Job
            </button>
            <button onClick={onCancel} className="secondary-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onEdit, onDelete, index, onDragStart, onDragOver, onDrop }) => {
  const getStatusColor = (status) => {
    const colors = {
      applied: '#3498db',
      interview: '#f39c12',
      'on hold': '#95a5a6',
      rejected: '#e74c3c',
      offer: '#27ae60'
    };
    return colors[status] || '#333';
  };

  return (
    <div 
      className="job-card-compact"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, index)}
    >
      <div className="job-drag-handle">⋮⋮</div>
      <div className="job-header-compact">
        <div className="job-info">
          <h3 className="job-title-compact">{job.position}</h3>
          <p className="company-compact">{job.company}</p>
        </div>
        <div className="job-actions-compact">
          <span 
            className="status-badge-compact" 
            style={{backgroundColor: getStatusColor(job.status)}}
          >
            {job.status.toUpperCase()}
          </span>
        </div>
      </div>
      
      {job.skills && job.skills.length > 0 && (
        <div className="skills-compact">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag-compact">{skill}</span>
          ))}
          {job.skills.length > 3 && <span className="skill-tag-compact">+{job.skills.length - 3}</span>}
        </div>
      )}
      
      <div className="job-footer-compact">
        <div className="job-meta">
          <small className="job-date-compact">
            {new Date(job.createdAt).toLocaleDateString()}
          </small>
          {job.resume && (
            <a 
              href={`http://localhost:5000${job.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link-compact"
            >
              📄
            </a>
          )}
        </div>
        <div className="job-buttons">
          <button onClick={() => onEdit(job)} className="edit-button-compact">Edit</button>
          <button onClick={() => onDelete(job._id)} className="delete-button-compact">Delete</button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        ‹
      </button>
      
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="pagination-button">1</button>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="pagination-button">{totalPages}</button>
        </>
      )}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        ›
      </button>
    </div>
  );
};

// Enhanced Dashboard Page with Analytics
const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.jobs.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      interview: 0,
      'on hold': 0,
      rejected: 0,
      offer: 0
    };
    jobs.forEach(job => {
      counts[job.status] = (counts[job.status] || 0) + 1;
    });
    return counts;
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: '#3498db',
      interview: '#f39c12',
      'on hold': '#95a5a6',
      rejected: '#e74c3c',
      offer: '#27ae60'
    };
    return colors[status] || '#333';
  };

  const exportToCSV = () => {
    if (jobs.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Company', 'Position', 'Status', 'Applied Date', 'Skills'];
    const csvData = jobs.map(job => [
      job.company,
      job.position,
      job.status,
      new Date(job.createdAt).toLocaleDateString(),
      job.skills ? job.skills.join(';') : ''
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = getStatusCounts();
  
  const chartData = Object.entries(statusCounts)
    .filter(([_, value]) => value > 0)
    .map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value
    }));

  const chartColors = ['#3498db', '#f39c12', '#95a5a6', '#e74c3c', '#27ae60'];

  return (
    <div className="page-content">
      <div className="page-header-with-button">
        <div>
          <h1>Dashboard & Analytics</h1>
          <p className="page-subtitle">Overview of your job applications with insights</p>
        </div>
        <button onClick={exportToCSV} className="export-button">
          📥 Export to CSV
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Applications</h3>
          <div className="stat-number">{jobs.length}</div>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="stat-card">
            <h3 className="stat-title" style={{color: getStatusColor(status)}}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <div className="stat-number">{count}</div>
          </div>
        ))}
      </div>

      <div className="analytics-section">
        <div className="analytics-card">
          <h3>Application Status Distribution</h3>
          <div className="chart-container">
            {jobs.length > 0 ? (
              <PieChart data={chartData} colors={chartColors} />
            ) : (
              <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                No data available. Start adding job applications to see analytics!
              </p>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-icon">🎯</span>
              <div>
                <div className="metric-label">Success Rate</div>
                <div className="metric-value">
                  {jobs.length > 0 ? Math.round((statusCounts.offer / jobs.length) * 100) : 0}%
                </div>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">⏳</span>
              <div>
                <div className="metric-label">Pending Responses</div>
                <div className="metric-value">
                  {statusCounts.applied + statusCounts['on hold']}
                </div>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">📝</span>
              <div>
                <div className="metric-label">In Interview</div>
                <div className="metric-value">{statusCounts.interview}</div>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon">✅</span>
              <div>
                <div className="metric-label">Offers Received</div>
                <div className="metric-value">{statusCounts.offer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="recent-jobs">
            {jobs.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No applications yet. Start adding jobs to see activity!
              </p>
            ) : (
              jobs.slice(0, 5).map(job => (
                <div key={job._id} className="recent-job-item">
                  <div>
                    <strong>{job.position}</strong>
                    <p>{job.company}</p>
                  </div>
                  <span className="status-mini" style={{backgroundColor: getStatusColor(job.status)}}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Application Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <div>
                <div className="insight-label">Most Common Status</div>
                <div className="insight-value">
                  {jobs.length > 0 
                    ? Object.entries(statusCounts)
                        .sort((a, b) => b[1] - a[1])[0][0]
                        .charAt(0).toUpperCase() + Object.entries(statusCounts)
                        .sort((a, b) => b[1] - a[1])[0][0].slice(1)
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🏢</span>
              <div>
                <div className="insight-label">Total Companies</div>
                <div className="insight-value">
                  {new Set(jobs.map(j => j.company)).size}
                </div>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">⭐</span>
              <div>
                <div className="insight-label">Response Rate</div>
                <div className="insight-value">
                  {jobs.length > 0 
                    ? Math.round(((statusCounts.interview + statusCounts.offer + statusCounts.rejected) / jobs.length * 100))
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Applications Page
const ApplicationsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);

  const jobsPerPage = 10;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const fetchJobs = async () => {
    try {
      const data = await api.jobs.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.jobs.delete(jobId);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) return;

    const updatedJobs = [...jobs];
    const draggedJob = updatedJobs[draggedItem];
    
    updatedJobs.splice(draggedItem, 1);
    updatedJobs.splice(dropIndex, 0, draggedJob);
    
    setJobs(updatedJobs);
    setDraggedItem(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Applications</h1>
        <p className="page-subtitle">Manage all your job applications</p>
      </div>

      <div className="jobs-list-compact">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No job applications yet. Click the + button to add your first application!</p>
          </div>
        ) : (
          paginatedJobs.map((job, index) => (
            <JobCard
              key={job._id}
              job={job}
              index={startIndex + index}
              onEdit={setEditJob}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <button 
        className="floating-add-button"
        onClick={() => setShowForm(true)}
        title="Add New Job"
      >
        +
      </button>

      {(showForm || editJob) && (
        <JobForm 
          onJobAdded={() => {
            fetchJobs();
            setShowForm(false);
            setEditJob(null);
          }}
          editJob={editJob}
          onCancel={() => {
            setShowForm(false);
            setEditJob(null);
          }}
        />
      )}
    </div>
  );
};

// Notes Page Component
const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [selectedJob, setSelectedJob] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchJobs();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await api.notes.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await api.jobs.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.notes.delete(noteId);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const getInterviewTypeIcon = (type) => {
    const icons = {
      'Phone Screen': '📞',
      'Technical': '💻',
      'System Design': '🏗️',
      'Behavioral': '🗣️',
      'HR': '👔',
      'On-site': '🏢',
      'General': '📝'
    };
    return icons[type] || '📝';
  };

  const filteredNotes = notes.filter(note => {
    const matchesJob = selectedJob === 'all' || note.jobId === selectedJob;
    const matchesSearch = note.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJob && matchesSearch;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header-with-button">
        <div>
          <h1>Notes & Experience</h1>
          <p className="page-subtitle">Track your interview experiences and preparation notes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="primary-button">
          ➕ Add Note
        </button>
      </div>

      <div className="notes-filters">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="form-select"
        >
          <option value="all">All Companies</option>
          {jobs.map(job => (
            <option key={job._id} value={job._id}>
              {job.company} - {job.position}
            </option>
          ))}
        </select>
      </div>

      <div className="notes-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Notes</h3>
          <div className="stat-number">{notes.length}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Companies Tracked</h3>
          <div className="stat-number">
            {new Set(notes.map(n => n.company)).size}
          </div>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Avg Rating</h3>
          <div className="stat-number">
            {notes.length > 0
              ? (notes.reduce((sum, n) => sum + (n.rating || 0), 0) / notes.filter(n => n.rating).length).toFixed(1)
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="notes-timeline">
        {filteredNotes.length === 0 ? (
          <div className="no-jobs">
            <p>No notes found. Start adding interview experiences!</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note._id} className="note-card">
              <div className="note-header">
                <div className="note-title-section">
                  <span className="note-icon">{getInterviewTypeIcon(note.interviewType)}</span>
                  <div>
                    <h3 className="note-title">{note.company}</h3>
                    <p className="note-subtitle">{note.position} • {note.interviewType} • {note.round}</p>
                  </div>
                </div>
                <div className="note-actions">
                  {note.rating && (
                    <div className="note-rating">
                      {'⭐'.repeat(note.rating)}
                    </div>
                  )}
                  <button onClick={() => setEditNote(note)} className="edit-button-compact">Edit</button>
                  <button onClick={() => handleDelete(note._id)} className="delete-button-compact">Delete</button>
                </div>
              </div>

              {note.interviewDate && (
                <div className="note-date">
                  📅 {new Date(note.interviewDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}

              <div className="note-content">
                <h4>Interview Notes:</h4>
                <p>{note.content}</p>
              </div>

              {note.questionsAsked && note.questionsAsked.length > 0 && (
                <div className="note-section">
                  <h4>Questions Asked:</h4>
                  <ul className="questions-list">
                    {note.questionsAsked.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.learnings && (
                <div className="note-section">
                  <h4>✅ What Went Well:</h4>
                  <p>{note.learnings}</p>
                </div>
              )}

              {note.improvements && (
                <div className="note-section">
                  <h4>📈 Areas for Improvement:</h4>
                  <p>{note.improvements}</p>
                </div>
              )}

              <div className="note-footer">
                <small>Created {new Date(note.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      {(showForm || editNote) && (
        <NoteForm
          jobs={jobs}
          onNoteSaved={() => {
            fetchNotes();
            setShowForm(false);
            setEditNote(null);
          }}
          editNote={editNote}
          onCancel={() => {
            setShowForm(false);
            setEditNote(null);
          }}
        />
      )}
    </div>
  );
};

// Note Form Component
const NoteForm = ({ jobs, onNoteSaved, editNote, onCancel }) => {
  const [formData, setFormData] = useState({
    jobId: '',
    company: '',
    position: '',
    interviewType: 'General',
    round: 'Round 1',
    interviewDate: '',
    rating: 3,
    questionsAsked: '',
    content: '',
    learnings: '',
    improvements: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editNote) {
      setFormData({
        ...editNote,
        questionsAsked: editNote.questionsAsked ? editNote.questionsAsked.join('\n') : '',
        interviewDate: editNote.interviewDate ? new Date(editNote.interviewDate).toISOString().split('T')[0] : '',
      });
    }
  }, [editNote]);

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    const selectedJob = jobs.find(j => j._id === jobId);
    
    if (selectedJob) {
      setFormData({
        ...formData,
        jobId,
        company: selectedJob.company,
        position: selectedJob.position,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const noteData = {
        ...formData,
        questionsAsked: formData.questionsAsked.split('\n').filter(q => q.trim()),
      };

      if (editNote) {
        await api.notes.update(editNote._id, noteData);
      } else {
        await api.notes.create(noteData);
      }

      onNoteSaved();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
      <div className="note-form-modal">
        <h3 className="form-title">{editNote ? 'Edit Note' : 'Add Interview Note'}</h3>
        <form onSubmit={handleSubmit} className="auth-form-container">
          <select
            value={formData.jobId}
            onChange={handleJobSelect}
            className="form-select"
            required
          >
            <option value="">Select Job Application</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.company} - {job.position}
              </option>
            ))}
          </select>

          <div className="form-row-2col">
            <select
              value={formData.interviewType}
              onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
              className="form-select"
            >
              <option value="General">General</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Technical">Technical</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
              <option value="HR">HR</option>
              <option value="On-site">On-site</option>
            </select>

            <input
              type="text"
              placeholder="Round (e.g., Round 1)"
              value={formData.round}
              onChange={(e) => setFormData({...formData, round: e.target.value})}
              className="form-input"
            />
          </div>

          <input
            type="date"
            value={formData.interviewDate}
            onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
            className="form-input"
          />

          <div>
            <label className="file-label">Rating: {formData.rating} ⭐</label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="rating-slider"
            />
          </div>

          <textarea
            placeholder="Interview Notes (required)"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="form-textarea"
            rows="4"
            required
          />

          <textarea
            placeholder="Questions Asked (one per line)"
            value={formData.questionsAsked}
            onChange={(e) => setFormData({...formData, questionsAsked: e.target.value})}
            className="form-textarea"
            rows="3"
          />

          <textarea
            placeholder="What Went Well / Learnings"
            value={formData.learnings}
            onChange={(e) => setFormData({...formData, learnings: e.target.value})}
            className="form-textarea"
            rows="3"
          />

          <textarea
            placeholder="Areas for Improvement"
            value={formData.improvements}
            onChange={(e) => setFormData({...formData, improvements: e.target.value})}
            className="form-textarea"
            rows="3"
          />

          <div className="form-buttons">
            <button 
              type="submit" 
              className={`primary-button ${saving ? 'disabled' : ''}`}
              disabled={saving}
            >
              {saving ? 'Saving...' : (editNote ? 'Update Note' : 'Save Note')}
            </button>
            <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Complete Alerts Page Component
const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAlert, setEditAlert] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
    fetchJobs();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await api.alerts.getAll();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await api.jobs.getAll();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await api.alerts.delete(alertId);
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleToggleComplete = async (alertId) => {
    try {
      await api.alerts.toggleComplete(alertId);
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'follow-up': '📧',
      'interview-prep': '📝',
      'deadline': '⏰',
      'thank-you': '💌',
      'custom': '🔔'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#3498db'
    };
    return colors[priority] || '#95a5a6';
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const isToday = (date) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const getFilteredAlerts = () => {
    const now = new Date();
    
    return alerts.filter(alert => {
      const alertDate = new Date(alert.alertDate);
      
      switch(filter) {
        case 'today':
          return isToday(alertDate) && !alert.isCompleted;
        case 'upcoming':
          return alertDate > now && !alert.isCompleted;
        case 'overdue':
          return isOverdue(alertDate) && !alert.isCompleted;
        case 'completed':
          return alert.isCompleted;
        default:
          return true;
      }
    });
  };

  const filteredAlerts = getFilteredAlerts();

  const stats = {
    total: alerts.length,
    today: alerts.filter(a => isToday(a.alertDate) && !a.isCompleted).length,
    overdue: alerts.filter(a => isOverdue(a.alertDate) && !a.isCompleted).length,
    completed: alerts.filter(a => a.isCompleted).length
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header-with-button">
        <div>
          <h1>Alerts & Reminders</h1>
          <p className="page-subtitle">Stay on top of deadlines and follow-ups</p>
        </div>
        <button onClick={() => setShowForm(true)} className="primary-button">
          ➕ Add Alert
        </button>
      </div>

      <div className="notes-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Alerts</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-title" style={{color: '#f39c12'}}>Due Today</h3>
          <div className="stat-number">{stats.today}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-title" style={{color: '#e74c3c'}}>Overdue</h3>
          <div className="stat-number">{stats.overdue}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-title" style={{color: '#27ae60'}}>Completed</h3>
          <div className="stat-number">{stats.completed}</div>
        </div>
      </div>

      <div className="alert-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button 
          className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-button ${filter === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          Overdue
        </button>
        <button 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="no-jobs">
            <p>No alerts found. Create your first reminder!</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div 
              key={alert._id} 
              className={`alert-card ${alert.isCompleted ? 'completed' : ''} ${isOverdue(alert.alertDate) && !alert.isCompleted ? 'overdue' : ''} ${isToday(alert.alertDate) && !alert.isCompleted ? 'today' : ''}`}
            >
              <div className="alert-header">
                <div className="alert-title-section">
                  <input
                    type="checkbox"
                    checked={alert.isCompleted}
                    onChange={() => handleToggleComplete(alert._id)}
                    className="alert-checkbox"
                  />
                  <span className="alert-type-icon">{getAlertTypeIcon(alert.type)}</span>
                  <div>
                    <h3 className="alert-title">{alert.title}</h3>
                    {alert.jobId && (
                      <p className="alert-job">
                        {alert.jobId.company} - {alert.jobId.position}
                      </p>
                    )}
                  </div>
                </div>
                <div className="alert-actions">
                  <span 
                    className="priority-badge"
                    style={{backgroundColor: getPriorityColor(alert.priority)}}
                  >
                    {alert.priority.toUpperCase()}
                  </span>
                  <button onClick={() => setEditAlert(alert)} className="edit-button-compact">Edit</button>
                  <button onClick={() => handleDelete(alert._id)} className="delete-button-compact">Delete</button>
                </div>
              </div>

              {alert.description && (
                <p className="alert-description">{alert.description}</p>
              )}

              <div className="alert-footer">
                <span className="alert-date">
                  📅 {new Date(alert.alertDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                  {' at '}
                  ⏰ {new Date(alert.alertDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {isOverdue(alert.alertDate) && !alert.isCompleted && (
                    <span className="overdue-badge"> • OVERDUE</span>
                  )}
                  {isToday(alert.alertDate) && !alert.isCompleted && (
                    <span className="today-badge"> • TODAY</span>
                  )}
                </span>
                <span className="alert-type">{alert.type.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {(showForm || editAlert) && (
        <AlertForm
          jobs={jobs}
          onAlertSaved={() => {
            fetchAlerts();
            setShowForm(false);
            setEditAlert(null);
          }}
          editAlert={editAlert}
          onCancel={() => {
            setShowForm(false);
            setEditAlert(null);
          }}
        />
      )}
    </div>
  );
};

// Alert Form Component
const AlertForm = ({ jobs, onAlertSaved, editAlert, onCancel }) => {
  const [formData, setFormData] = useState({
    jobId: '',
    type: 'custom',
    title: '',
    description: '',
    alertDate: '',
    alertTime: '09:00',
    priority: 'medium',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editAlert) {
      const alertDateTime = new Date(editAlert.alertDate);
      const dateStr = alertDateTime.toISOString().split('T')[0];
      const timeStr = alertDateTime.toTimeString().slice(0, 5);
      
      setFormData({
        jobId: editAlert.jobId?._id || '',
        type: editAlert.type,
        title: editAlert.title,
        description: editAlert.description || '',
        alertDate: dateStr,
        alertTime: timeStr,
        priority: editAlert.priority,
      });
    }
  }, [editAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dateTimeString = `${formData.alertDate}T${formData.alertTime}:00`;
      const alertDateTime = new Date(dateTimeString);

      const alertData = {
        jobId: formData.jobId || null,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        alertDate: alertDateTime.toISOString(),
        priority: formData.priority,
      };

      if (editAlert) {
        await api.alerts.update(editAlert._id, alertData);
      } else {
        await api.alerts.create(alertData);
      }

      onAlertSaved();
    } catch (error) {
      console.error('Error saving alert:', error);
      alert('Error saving alert. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="job-form-overlay" onClick={(e) => e.target.className === 'job-form-overlay' && onCancel()}>
      <div className="note-form-modal">
        <h3 className="form-title">{editAlert ? 'Edit Alert' : 'Add New Alert'}</h3>
        <form onSubmit={handleSubmit} className="auth-form-container">
          <input
            type="text"
            placeholder="Alert Title (required)"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="form-input"
            required
          />

          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="form-select"
          >
            <option value="custom">Custom Reminder</option>
            <option value="follow-up">Follow-up</option>
            <option value="interview-prep">Interview Preparation</option>
            <option value="deadline">Application Deadline</option>
            <option value="thank-you">Send Thank You Email</option>
          </select>

          <select
            value={formData.jobId}
            onChange={(e) => setFormData({...formData, jobId: e.target.value})}
            className="form-select"
          >
            <option value="">General Reminder (No Job)</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.company} - {job.position}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="form-textarea"
            rows="3"
          />

          <div className="form-row-2col">
            <div>
              <label className="file-label">Date</label>
              <input
                type="date"
                value={formData.alertDate}
                onChange={(e) => setFormData({...formData, alertDate: e.target.value})}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="file-label">Time</label>
              <input
                type="time"
                value={formData.alertTime}
                onChange={(e) => setFormData({...formData, alertTime: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>

          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="form-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <div className="form-buttons">
            <button 
              type="submit" 
              className={`primary-button ${saving ? 'disabled' : ''}`}
              disabled={saving}
            >
              {saving ? 'Saving...' : (editAlert ? 'Update Alert' : 'Create Alert')}
            </button>
            <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// NEW: Profile Page Component
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.profile.update(formData.name, formData.email);
      updateUser(response.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="page-subtitle">Update your account information</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <div className="profile-card-simple">
        <h3>Profile Information</h3>
        <form onSubmit={handleSubmit} className="auth-form-container">
          <div>
            <label className="file-label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="file-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-input"
              required
            />
          </div>

          <div className="profile-info-box">
            {/* <p><strong>User ID:</strong> {user?._id}</p> */}
            <p><strong>Account Created On:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Layout with Mobile Menu State
const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="main-layout">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="main-content">
        <header className="top-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <h1 className="app-title">Job Application Tracker</h1>
            </div>
            <div className="user-section">
              <span className="welcome-text">Welcome, {user.name}!</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        </header>
        
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* NEW ROUTE */}
          </Routes>
        </div>
      </div>
      
      <NotificationPermission />
      <AlertChecker />
    </div>
  );
};

// Auth Page
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm switchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterForm switchToLogin={() => setIsLogin(true)} />
  );
};

// Main App
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? (
    <Router>
      <MainLayout />
    </Router>
  ) : (
    <AuthPage />
  );
};

// App with Provider
export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}