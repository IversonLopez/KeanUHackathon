const API_BASE_URL = 'http://localhost:5000';

export const getCityData = async (cityName) => {
  const mockData = {
    Elizabeth: {
      riskScore: 78,
      population: 137298,
      scamTypes: {
        phone: 85,
        email: 75,
        text: 80,
        inPerson: 70,
        socialMedia: 82
      }
    },
    'Union Township': {
      riskScore: 65,
      population: 59387,
      scamTypes: {
        phone: 70,
        email: 65,
        text: 68,
        inPerson: 60,
        socialMedia: 63
      }
    },
    Plainfield: {
      riskScore: 72,
      population: 54586,
      scamTypes: {
        phone: 75,
        email: 70,
        text: 73,
        inPerson: 65,
        socialMedia: 76
      }
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[cityName] || {
        riskScore: Math.floor(Math.random() * 100),
        population: Math.floor(Math.random() * 100000) + 20000,
        scamTypes: {
          phone: Math.floor(Math.random() * 100),
          email: Math.floor(Math.random() * 100),
          text: Math.floor(Math.random() * 100),
          inPerson: Math.floor(Math.random() * 100),
          socialMedia: Math.floor(Math.random() * 100)
        }
      });
    }, 1000);
  });
};

const getRiskLevel = (score) => {
  if (score < 30) return 'Low Risk';
  if (score < 60) return 'Medium Risk';
  return 'High Risk';
};

export const getAllScamData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scam-data`);
    if (!response.ok) {
      throw new Error('Failed to fetch scam data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all scam data:', error);
    throw error;
  }
}; 