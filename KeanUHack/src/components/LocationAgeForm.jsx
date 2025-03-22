import React, { useState } from 'react';

const LocationAgeForm = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ location, age });
  };

  return (
    <div className="bg-[#003366] p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-[#004080] text-white border border-[#0059b3] rounded"
            placeholder="Enter your location"
            required
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 bg-[#004080] text-white border border-[#0059b3] rounded"
            placeholder="Enter your age"
            required
            min="0"
            max="120"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LocationAgeForm; 