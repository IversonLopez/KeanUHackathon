import React from 'react';

const CitySelector = ({ cities, selectedCity, onCitySelect }) => {
  return (
    <div className="bg-[#003366] p-4 rounded-lg shadow-lg">
      <select
        value={selectedCity}
        onChange={(e) => onCitySelect(e.target.value)}
        className="w-full p-2 bg-[#004080] text-white border border-[#0059b3] rounded"
      >
        {cities.map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector; 