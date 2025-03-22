import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ScamHeatmap from './ScamHeatmap';

const ScamDashboard = () => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (showHeatmap) {
    return (
      <div className="min-h-screen bg-[#00264d]">
        <div className="p-4">
          <button
            onClick={() => setShowHeatmap(false)}
            className="flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        <ScamHeatmap />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00264d] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Scam Prevention Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Regional Risk Map</h2>
            <p className="text-gray-300 mb-4">
              View scam risk levels across different areas in Union County.
            </p>
            <button
              onClick={() => setShowHeatmap(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              View Map
            </button>
          </div>

          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Report a Scam</h2>
            <p className="text-gray-300 mb-4">
              Help your community by reporting scam attempts.
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              onClick={() => window.open('https://www.ftc.gov/complaint', '_blank')}
            >
              File Report
            </button>
          </div>

          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>
            <ul className="text-gray-300 space-y-2">
              <li>Union County Police: 908-654-9800</li>
              <li>NJ Consumer Affairs: 973-504-6200</li>
              <li>FTC Scam Report: 1-877-FTC-HELP</li>
            </ul>
          </div>

          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Latest Scam Alerts</h2>
            <ul className="text-gray-300 space-y-2">
              <li>⚠️ Phone scams impersonating IRS officials</li>
              <li>⚠️ Fake job offers requesting personal information</li>
              <li>⚠️ Text messages claiming lottery winnings</li>
            </ul>
          </div>

          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Prevention Tips</h2>
            <ul className="text-gray-300 space-y-2">
              <li>Never share personal information over phone/email</li>
              <li>Verify caller identity through official channels</li>
              <li>Be wary of urgent payment requests</li>
            </ul>
          </div>

          <div className="bg-[#003366] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Resources</h2>
            <ul className="text-gray-300 space-y-2">
              <li>
                <a
                  href="https://www.consumer.ftc.gov/features/scam-alerts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  FTC Scam Alerts
                </a>
              </li>
              <li>
                <a
                  href="https://www.usa.gov/common-scams-frauds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  Common Scams Guide
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition-colors"
                >
                  Internet Crime Complaint Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamDashboard; 