import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ScamHeatmap = ({ onBack }) => {
  const [selectedCity, setSelectedCity] = useState('Elizabeth');
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [analysis, setAnalysis] = useState({ text: '', loading: false, error: null });
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const cities = [
    {
      name: "Elizabeth",
      riskLevel: "High Risk",
      score: 78.4,
      position: { lat: 40.6639, lng: -74.2107 },
      categories: {
        phone: 82.6,
        email: 74.2,
        text: 76.9,
        in_person: 73.1,
        social_media: 79.5
      },
      population: 129216
    },
    {
      name: "Plainfield",
      riskLevel: "High Risk",
      score: 71.2,
      position: { lat: 40.6337, lng: -74.4171 },
      categories: {
        phone: 73.8,
        email: 68.5,
        text: 74.1,
        in_person: 69.7,
        social_media: 71.9
      },
      population: 50588
    },
    {
      name: "Union Township",
      riskLevel: "Moderate Risk",
      score: 56.7,
      position: { lat: 40.7016, lng: -74.2632 },
      categories: {
        phone: 61.2,
        email: 54.8,
        text: 58.3,
        in_person: 51.9,
        social_media: 57.4
      },
      population: 58515
    },
    {
      name: "Westfield",
      riskLevel: "Low Risk",
      score: 38.9,
      position: { lat: 40.6590, lng: -74.3473 },
      categories: {
        phone: 42.3,
        email: 41.5,
        text: 36.7,
        in_person: 32.8,
        social_media: 38.2
      },
      population: 30316
    },
    {
      name: "Linden",
      riskLevel: "High Risk",
      score: 62.8,
      position: { lat: 40.6221, lng: -74.2446 },
      categories: {
        phone: 67.1,
        email: 60.4,
        text: 64.9,
        in_person: 58.7,
        social_media: 61.5
      },
      population: 42474
    },
    {
      name: "Summit",
      riskLevel: "Low Risk",
      score: 32.5,
      position: { lat: 40.7146, lng: -74.3646 },
      categories: {
        phone: 35.9,
        email: 37.8,
        text: 29.7,
        in_person: 26.4,
        social_media: 31.8
      },
      population: 21913
    }
  ];

  const defaultCenter = {
    lat: 40.7102,
    lng: -74.3345
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel.includes('Very High')) return '#c0392b';
    if (riskLevel.includes('High')) return '#e74c3c';
    if (riskLevel.includes('Moderate')) return '#f39c12';
    if (riskLevel.includes('Low')) return '#27ae60';
    return '#2ecc71';
  };

  const generateAIAnalysis = async (city) => {
    setAnalysis({ text: '', loading: true, error: null });
    console.log('Generating analysis for:', city.name);
    console.log('Using model: mistralai/mistral-7b-instruct');

    const prompt = `You are an AI risk analysis expert. Analyze the scam risk data for ${city.name}, NJ with the following statistics:

Overall risk score: ${city.score}/100 (${city.riskLevel})
Population: ${city.population}
Risk categories:
- Phone scams: ${city.categories.phone}/100
- Email scams: ${city.categories.email}/100
- Text message scams: ${city.categories.text}/100
- In-person scams: ${city.categories.in_person}/100
- Social media scams: ${city.categories.social_media}/100

Generate a detailed risk analysis report with these sections:

1. OVERVIEW:
- Evaluate what this risk level means for residents
- Compare to typical suburban areas
- Discuss population size impact

2. RISK BREAKDOWN:
- Analyze highest and lowest risk categories
- Explain prevalence of specific scam types
- Identify patterns and correlations

3. VULNERABLE POPULATIONS:
- Identify at-risk groups
- Explain vulnerability factors
- Discuss demographic impacts

4. RECOMMENDATIONS:
- List specific protective measures
- Suggest community initiatives
- Include emergency contacts

Format the response with clear section headers in uppercase. Be specific and actionable. Do not use asterisks or other special formatting characters.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Scam Risk Analysis'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an AI risk analysis expert specializing in scam and fraud prevention. Provide clear, actionable insights based on data. Use a professional but accessible tone.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Invalid API response format');
      }

      let generatedText = data.choices[0].message.content;

      // Add emergency contacts if not included in the AI response
      if (!generatedText.includes('Emergency Contacts')) {
        generatedText += `\n\nEMERGENCY CONTACTS:
- Union County Police: 908-654-9800
- NJ Consumer Affairs: 973-504-6200
- FTC Scam Report: 1-877-FTC-HELP
- Local Police (non-emergency): ${
  city.name === 'Elizabeth' ? '908-558-2000' :
  city.name === 'Plainfield' ? '908-753-3131' :
  city.name === 'Union Township' ? '908-851-5000' :
  city.name === 'Westfield' ? '908-789-4000' :
  city.name === 'Linden' ? '908-474-8500' :
  '908-273-0051' // Summit
}`;
      }

      setAnalysis({
        text: generatedText,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      
      const categories = Object.entries(city.categories);
      const highestRiskCategory = categories.reduce((max, curr) => 
        curr[1] > max[1] ? { category: curr[0], score: curr[1] } : max,
        { category: categories[0][0], score: categories[0][1] }
      );
      const lowestRiskCategory = categories.reduce((min, curr) => 
        curr[1] < min[1] ? { category: curr[0], score: curr[1] } : min,
        { category: categories[0][0], score: categories[0][1] }
      );
      const avgRisk = categories.reduce((sum, curr) => sum + curr[1], 0) / categories.length;

      const fallbackAnalysis = `
OVERVIEW:
${city.name} currently experiences a ${city.riskLevel.toLowerCase()} level of scam activity with an overall risk score of ${city.score}/100. With a population of ${city.population.toLocaleString()}, this ${city.score > 60 ? 'elevated' : 'moderate to low'} risk level requires attention.

RISK BREAKDOWN:
The highest risk comes from ${highestRiskCategory.category.replace('_', ' ')} scams at ${highestRiskCategory.score}/100, while ${lowestRiskCategory.category.replace('_', ' ')} scams show the lowest risk at ${lowestRiskCategory.score}/100. Average risk: ${avgRisk.toFixed(1)}/100.

VULNERABLE POPULATIONS:
- Elderly residents
- New residents
- Non-English speakers
${city.population > 50000 ? '- Residents in densely populated areas' : '- Residents in less populated areas'}

RECOMMENDATIONS:
1. Stay vigilant with communications
2. Verify unexpected requests
3. Report suspicious activity
4. Join community watch programs

EMERGENCY CONTACTS:
- Union County Police: 908-654-9800
- NJ Consumer Affairs: 973-504-6200
- FTC Scam Report: 1-877-FTC-HELP
- Local Police (non-emergency): ${
  city.name === 'Elizabeth' ? '908-558-2000' :
  city.name === 'Plainfield' ? '908-753-3131' :
  city.name === 'Union Township' ? '908-851-5000' :
  city.name === 'Westfield' ? '908-789-4000' :
  city.name === 'Linden' ? '908-474-8500' :
  '908-273-0051' // Summit
}`;

      setAnalysis({
        text: fallbackAnalysis,
        loading: false,
        error: 'Failed to generate AI analysis. Showing template instead.'
      });
    }
  };

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDfgAjZ7FB-IexoIZNB4wO0y5_21Xc2Kxc&libraries=visualization`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup markers when component unmounts
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  useEffect(() => {
    const city = cities.find(c => c.name === selectedCity);
    if (city) {
      generateAIAnalysis(city);
    }
  }, [selectedCity]);

  const initializeMap = () => {
    // Create the map
    const mapInstance = new google.maps.Map(document.getElementById("map"), {
      center: defaultCenter,
      zoom: 11,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      styles: [
        {
          "featureType": "poi",
          "stylers": [{ "visibility": "off" }]
        }
      ]
    });

    setMap(mapInstance);

    // Add Union County boundary
    const unionCountyCoords = [
      { lat: 40.5699, lng: -74.4428 }, // SW
      { lat: 40.5699, lng: -74.2107 }, // SE
      { lat: 40.7356, lng: -74.2107 }, // NE
      { lat: 40.7356, lng: -74.4428 }  // NW
    ];

    const unionCountyBoundary = new google.maps.Polygon({
      paths: unionCountyCoords,
      strokeColor: "#1a73e8",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#1a73e8",
      fillOpacity: 0.1
    });

    unionCountyBoundary.setMap(mapInstance);

    // Add markers for each city
    const newMarkers = cities.map(city => {
      const marker = new google.maps.Marker({
        position: city.position,
        map: mapInstance,
        title: city.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getRiskColor(city.riskLevel),
          fillOpacity: 0.9,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          scale: 10
        }
      });

      marker.addListener('click', () => {
        setSelectedCity(city.name);
        mapInstance.panTo(city.position);
        mapInstance.setZoom(14);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const city = cities.find(c => c.name === cityName);
    if (city && map) {
      map.panTo(city.position);
      map.setZoom(14);
    }
  };

  const handleShowAllCities = () => {
    if (map) {
      map.setZoom(11);
      map.panTo(defaultCenter);
    }
  };

  const toggleMarkers = () => {
    markers.forEach(marker => {
      marker.setVisible(!marker.getVisible());
    });
  };

  const selectedCityData = cities.find(city => city.name === selectedCity);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1a73e8] p-4">
        <h1 className="text-4xl font-serif text-white text-center">Union County Scam Risk Map</h1>
        <p className="text-xl text-center text-white mt-2">
          AI-Powered Analysis of Scam Rates in Union County, New Jersey
        </p>
      </div>

      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div>Current Date and Time (UTC): {getCurrentDateTime()}</div>
          <div>Current User: Nazib65</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Navigation</h2>
              <select 
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700 mb-4"
              >
                {cities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name} ({city.riskLevel})
                  </option>
                ))}
              </select>
              <button 
                onClick={() => {
                  const city = cities.find(c => c.name === selectedCity);
                  if (city && map) {
                    map.panTo(city.position);
                    map.setZoom(14);
                  }
                }}
                className="w-full bg-[#1a73e8] text-white py-2 rounded mb-2 hover:bg-[#1557b0] transition-colors"
              >
                Go to City
              </button>
              <button 
                onClick={handleShowAllCities}
                className="w-full bg-[#1a73e8] text-white py-2 rounded hover:bg-[#1557b0] transition-colors"
              >
                Show All Cities
              </button>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-blue-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  AI Analysis API: Online
                </div>
              </div>
            </div>

            {/* Map Display Options */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Map Display Options</h2>
              <button 
                onClick={() => map?.setMapTypeId(map.getMapTypeId() === 'roadmap' ? 'satellite' : 'roadmap')}
                className="w-full bg-[#1a73e8] text-white py-2 rounded mb-2 hover:bg-[#1557b0] transition-colors"
              >
                Toggle Satellite View
              </button>
              <button 
                onClick={toggleMarkers}
                className="w-full bg-[#1a73e8] text-white py-2 rounded hover:bg-[#1557b0] transition-colors"
              >
                Toggle Markers
              </button>
            </div>

            {/* Risk Level Legend */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Scam Risk Legend</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#2ecc71' }} />
                  <span className="text-gray-700">Very Low Risk (0-20)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#27ae60' }} />
                  <span className="text-gray-700">Low Risk (20-40)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f39c12' }} />
                  <span className="text-gray-700">Moderate Risk (40-60)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#e74c3c' }} />
                  <span className="text-gray-700">High Risk (60-80)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#c0392b' }} />
                  <span className="text-gray-700">Very High Risk (80-100)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div id="map" style={{ height: "600px", width: "100%" }}></div>
            </div>

            {/* Selected City Info */}
            {selectedCityData && (
              <div className="bg-white rounded-lg p-6 mt-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{selectedCityData.name}</h2>
                  <div 
                    className="px-4 py-1 rounded-full text-white" 
                    style={{ backgroundColor: getRiskColor(selectedCityData.riskLevel) }}
                  >
                    Risk Level: {selectedCityData.riskLevel}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Population</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedCityData.population.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Risk Score</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedCityData.score}/100</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Scam Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(selectedCityData.categories).map(([category, score]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 capitalize">{category.replace('_', ' ')}</h4>
                        <p className="text-lg font-semibold text-gray-900">{score}/100</p>
                        <div className="mt-2 h-1 bg-gray-200 rounded">
                          <div 
                            className="h-full rounded" 
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: getRiskColor(score >= 80 ? 'Very High Risk' : 
                                                         score >= 60 ? 'High Risk' :
                                                         score >= 40 ? 'Moderate Risk' : 'Low Risk')
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Generated Risk Analysis</h3>
                  {isLoadingAnalysis ? (
                    <div className="text-gray-600">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Generating analysis for {selectedCityData.name}...</p>
                    </div>
                  ) : analysis.error ? (
                    <div className="text-gray-600">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-700">{analysis.error}</p>
                        <p className="text-sm text-red-600 mt-2">Please check the browser console for more details.</p>
                      </div>
                      <button 
                        onClick={() => generateAIAnalysis(selectedCityData)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-600 whitespace-pre-line">
                      {analysis.text || 'Loading analysis...'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamHeatmap; 