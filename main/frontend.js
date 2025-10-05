import React, { useState } from 'react';
import { MapPin, Waves, Thermometer, Eye, Upload, TrendingUp, AlertCircle } from 'lucide-react';

// Renamed the main component to App to comply with the single-file React mandate
const App = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedShark, setSelectedShark] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    species: '',
    location: '',
    date: '',
    observer: ''
  });

  // Mock Data
  const sharkData = [
    { id: 1, species: 'Great White', lat: -34.0, lon: 18.5, temp: 18.5, lastSeen: '2 hours ago', confidence: 92 },
    { id: 2, species: 'Tiger Shark', lat: -33.8, lon: 18.9, temp: 19.2, lastSeen: '5 hours ago', confidence: 87 },
    { id: 3, species: 'Bull Shark', lat: -33.5, lon: 18.3, temp: 20.1, lastSeen: '1 hour ago', confidence: 95 },
    { id: 4, species: 'Hammerhead', lat: -34.2, lon: 18.7, temp: 18.8, lastSeen: '3 hours ago', confidence: 89 },
  ];

  const migrationRoutes = [
    { name: 'South African Coast', activity: 'high', sharks: 23 },
    { name: 'Mediterranean Basin', activity: 'medium', sharks: 15 },
    { name: 'Great Barrier Reef', activity: 'high', sharks: 31 },
    { name: 'California Coast', activity: 'low', sharks: 8 },
  ];

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSightingSubmit = () => {
    if (formData.species && formData.location && formData.date && formData.observer) {
      const newSighting = {
        id: Date.now(),
        ...formData,
        status: 'pending'
      };
      // Add the new sighting to the start of the list
      setSightings([newSighting, ...sightings]); 
      setShowUploadForm(false);
      setFormData({ species: '', location: '', date: '', observer: '' });
    }
  };

  // Utility function to calculate map marker position (FIXED LOGIC)
  const calculatePosition = (lat, lon) => {
    // Simple Mercator-like projection approximation for display purposes
    const left = ((lon + 180) / 360) * 100;
    const top = ((90 - lat) / 180) * 100;
    return {
      left: `${left}%`,
      top: `${top}%`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white font-sans">
      <header className="bg-black bg-opacity-30 backdrop-blur-md border-b border-cyan-500 border-opacity-30 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Sharks from Space
                </h1>
                <p className="text-xs sm:text-sm text-cyan-300 opacity-80 hidden sm:block">Satellite-Based Shark Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-cyan-300">Last Updated</div>
                <div className="text-sm font-semibold">2 min ago</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-black bg-opacity-30 rounded-xl p-1 shadow-xl">
          {['map', 'analytics', 'sightings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/50'
                  : 'text-cyan-300 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-8">
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Live Map Section */}
            <div className="lg:col-span-2 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-cyan-400" />
                Live Shark Tracking Map
              </h2>
              {/* Map Visualization Container (Simulated) */}
              <div className="bg-gradient-to-br from-blue-950 to-cyan-950 rounded-xl h-80 sm:h-96 relative overflow-hidden shadow-inner">
                {/* Grid Overlay for effect */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Shark Markers (FIXED: Using calculatePosition function) */}
                {sharkData.map((shark) => (
                  <div
                    key={shark.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={calculatePosition(shark.lat, shark.lon)}
                    onClick={() => setSelectedShark(shark)}
                  >
                    <div className="relative">
                      {/* Ping animation */}
                      <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
                      {/* Actual Marker */}
                      <div className="relative bg-cyan-500 rounded-full p-2 border-2 border-white shadow-lg shadow-cyan-500/50 hover:scale-110 transition-transform">
                        <Waves className="w-4 h-4" />
                      </div>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl border border-cyan-700">
                      <div className="text-xs font-semibold">{shark.species}</div>
                      <div className="text-xs text-cyan-300">{shark.lastSeen}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Detected Sharks List */}
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
                <h3 className="text-lg font-bold mb-4">Detected Sharks</h3>
                <div className="space-y-3 max-h-64 lg:max-h-full overflow-y-auto custom-scrollbar pr-2">
                  {sharkData.map((shark) => (
                    <div
                      key={shark.id}
                      onClick={() => setSelectedShark(shark)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        selectedShark?.id === shark.id
                          ? 'bg-cyan-500 bg-opacity-30 border-cyan-400 shadow-lg'
                          : 'bg-white bg-opacity-5 hover:bg-opacity-10 border-transparent hover:border-cyan-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{shark.species}</div>
                        <div className="text-xs bg-cyan-600 px-2 py-1 rounded-full text-white">
                          {shark.confidence}% confidence
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-cyan-300">
                          <MapPin className="w-3 h-3 mr-2 text-cyan-400" />
                          <span className="text-xs">{shark.lat.toFixed(2)}°, {shark.lon.toFixed(2)}°</span>
                        </div>
                        <div className="flex items-center text-cyan-300">
                          <Thermometer className="w-3 h-3 mr-2 text-cyan-400" />
                          <span className="text-xs">{shark.temp}°C</span>
                        </div>
                        <div className="text-xs opacity-70 mt-1">Last Seen: {shark.lastSeen}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental Data */}
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
                <h3 className="text-lg font-bold mb-4">Environmental Data</h3>
                <div className="space-y-4">
                  {/* SST */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sea Surface Temp</span>
                      <span className="font-semibold text-cyan-300">18.5°C</span>
                    </div>
                    <div className="h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width: '65%'}} />
                    </div>
                  </div>
                  {/* Clarity */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Water Clarity</span>
                      <span className="font-semibold text-cyan-300">High</span>
                    </div>
                    <div className="h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width: '85%'}} />
                    </div>
                  </div>
                  {/* Chlorophyll */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Chlorophyll Level</span>
                      <span className="font-semibold text-cyan-300">Moderate</span>
                    </div>
                    <div className="h-2 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width: '55%'}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Migration Hotspots */}
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-cyan-400" />
                Migration Hotspots
              </h2>
              <div className="space-y-4">
                {migrationRoutes.map((route, idx) => (
                  <div key={idx} className="p-4 bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all border border-transparent hover:border-cyan-500/50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-lg">{route.name}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        route.activity === 'high' ? 'bg-red-600' :
                        route.activity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {route.activity.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-cyan-300">
                      <span>Detected Sharks: <span className='font-bold'>{route.sharks}</span></span>
                      <Waves className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics and Alerts */}
            <div className="space-y-6">
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Detection Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Stat Card 1 */}
                  <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                    <div className="text-4xl font-extrabold">77</div>
                    <div className="text-sm opacity-90">Total Detections</div>
                  </div>
                  {/* Stat Card 2 */}
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <div className="text-4xl font-extrabold">12</div>
                    <div className="text-sm opacity-90">Species Tracked</div>
                  </div>
                  {/* Stat Card 3 */}
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <div className="text-4xl font-extrabold">91%</div>
                    <div className="text-sm opacity-90">Avg Confidence</div>
                  </div>
                  {/* Stat Card 4 */}
                  <div className="p-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl shadow-lg">
                    <div className="text-4xl font-extrabold">45</div>
                    <div className="text-sm opacity-90">Community Reports</div>
                  </div>
                </div>
              </div>

              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                  Conservation Alerts
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-400 rounded-lg">
                    <div className="font-semibold text-sm">Increased Activity</div>
                    <div className="text-xs opacity-80 text-yellow-300">South African Coast - Great White sharks</div>
                  </div>
                  <div className="p-3 bg-blue-500 bg-opacity-20 border-l-4 border-blue-400 rounded-lg">
                    <div className="font-semibold text-sm">Migration Pattern</div>
                    <div className="text-xs opacity-80 text-blue-300">Tiger sharks moving north</div>
                  </div>
                  <div className="p-3 bg-red-500 bg-opacity-20 border-l-4 border-red-400 rounded-lg">
                    <div className="font-semibold text-sm">Urgent Warning</div>
                    <div className="text-xs opacity-80 text-red-300">Bull shark detected near major beach area</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sightings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2">
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center mb-4 sm:mb-0">
                    <Eye className="w-6 h-6 mr-2 text-cyan-400" />
                    Community Sightings
                  </h2>
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors font-semibold shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Report Sighting</span>
                  </button>
                </div>

                {showUploadForm && (
                  <div className="mb-6 p-6 bg-white bg-opacity-5 rounded-xl space-y-4 border border-cyan-500/30">
                    <h3 className="text-lg font-bold">New Sighting Report</h3>
                    {['species', 'location', 'date', 'observer'].map(field => (
                      <div key={field}>
                        <label className="block text-sm mb-2 capitalize">{field} {field === 'date' && '(e.g., YYYY-MM-DD HH:MM)'}</label>
                        <input
                          type={field === 'date' ? 'text' : 'text'}
                          value={formData[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className="w-full px-4 py-2 bg-black bg-opacity-50 border border-cyan-500 border-opacity-30 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white placeholder-cyan-300/50"
                          placeholder={`Enter ${field}`}
                          required
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleSightingSubmit}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors shadow-lg mt-4"
                    >
                      Submit Sighting
                    </button>
                    <p className="text-xs text-center text-red-400">All fields are required to submit a report.</p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Combining mock data and new sightings for display */}
                  {sightings.length > 0 || sharkData.length > 0 ? (
                     [...sightings, ...sharkData.map(s => ({...s, location: `${s.lat.toFixed(2)}°, ${s.lon.toFixed(2)}°`, date: `Today @ ${s.lastSeen}`, status: 'validated', observer: 'Satellite AI'}))].map((sighting) => (
                      <div key={sighting.id} className="p-4 bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all border border-transparent hover:border-cyan-500/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{sighting.species}</div>
                            <div className="text-sm text-cyan-300">{sighting.location}</div>
                            <div className="text-xs opacity-70 mt-1">Reported by: <span className="font-medium text-white">{sighting.observer}</span> on {sighting.date}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              sighting.status === 'pending' ? 'bg-yellow-500 bg-opacity-30 text-yellow-300' :
                              'bg-green-500 bg-opacity-30 text-green-300'
                          }`}>
                            {sighting.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-cyan-300 opacity-60">
                      No community sightings yet. Use the "Report Sighting" button to contribute!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* How to Report Panel */}
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500 border-opacity-30 shadow-2xl h-fit sticky top-24">
              <h3 className="text-lg font-bold mb-4">How to Report</h3>
              <div className="space-y-4 text-sm text-cyan-300">
                <p>Help us track sharks by reporting your sightings quickly and accurately.</p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-black">1</div>
                    <div className='text-white/90'>Note the **exact location** (coordinates or landmark) and **time** of your sighting.</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-black">2</div>
                    <div className='text-white/90'>Identify the **species** if possible (Great White, Tiger, etc.).</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold text-black">3</div>
                    <div className='text-white/90'>Submit your report using the form. All reports are marked **Pending** until validated.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
       {/* Custom scrollbar style for overflow containers */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #06b6d4; /* cyan-500 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2; /* cyan-600 */
        }
      `}</style>
    </div>
  );
};

export default App;