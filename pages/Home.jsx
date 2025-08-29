import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BarChart3, Zap, Shield, Users, File, Trash2, Eye } from "lucide-react";
import Navigation from '../src/components/Navigation';
import { excelAPI } from '../src/services/api';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get deep insights with powerful data visualization and statistical analysis"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Process large Excel files instantly with our optimized engine"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely in our database"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Share insights and collaborate with your team seamlessly"
    }
  ];

  const stats = [
    { value: "10K+", label: "Files Analyzed" },
    { value: "50K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      setLoadingFiles(true);
      const response = await excelAPI.getFiles();
      setUserFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      alert("Please upload an XLSX file!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await excelAPI.uploadFile(formData);
      const { data, file: uploadedFile } = response.data;
      
      // Update progress to 100% on successful upload
      setUploadProgress(100);
      
      // Add new file to the list
      setUserFiles(prev => [uploadedFile, ...prev]);
      
      // Navigate to dashboard with the data
      setTimeout(() => {
        navigate("/dashboard", { state: { data, fileId: uploadedFile._id } });
      }, 1500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-purple-400 to-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Transform Your Excel Data into
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {" "}Actionable Insights
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Upload your Excel files and instantly get powerful analytics, visualizations, 
            and insights that drive better business decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition transform hover:scale-105"
            >
              Start Analyzing
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to analyze your Excel data</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800/70 transition">
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Upload Your Excel File</h2>
            <p className="text-xl text-gray-300">Drag & drop or click to upload your .xlsx file</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Drop your Excel file here</h3>
              <p className="text-gray-400 mb-4">or</p>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
                id="file-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-4">Supports .xlsx files up to 10MB</p>
            </div>

            {(isUploading || uploadProgress > 0) && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{isUploading ? 'Uploading...' : 'Processing...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Files Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Your Files</h2>
            <p className="text-xl text-gray-300">Manage your uploaded Excel files</p>
          </div>
          
          {loadingFiles ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : userFiles.length === 0 ? (
            <div className="text-center">
              <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No files uploaded yet. Upload your first file above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userFiles.map((file) => (
                <div key={file._id} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <File className="w-8 h-8 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">{file.originalName}</h4>
                      <p className="text-gray-400 text-sm">
                        {file.rowCount} rows • {file.columns.length} columns • {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate("/dashboard", { state: { fileId: file._id } })}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this file?')) {
                          try {
                            await excelAPI.deleteFile(file._id);
                            setUserFiles(prev => prev.filter(f => f._id !== file._id));
                          } catch (error) {
                            console.error('Error deleting file:', error);
                            alert('Failed to delete file');
                          }
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ExcelAnalyzer Pro</span>
              </div>
              <p className="text-gray-400">Transform your Excel data into actionable insights with powerful analytics.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ExcelAnalyzer Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
