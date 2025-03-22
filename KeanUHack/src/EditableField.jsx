import { useState } from 'react';

const EditableField = ({ 
  isEditing, 
  setIsEditing, 
  placeholder, 
  type = "text",
  isHighAccessibility = false,
  onValueChange
}) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = type === "number" 
      ? e.target.value.replace(/[^0-9]/g, '')
      : e.target.value;
    
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div onClick={() => setIsEditing(true)} className="w-full relative overflow-hidden">
      <div className="transform transition-all duration-500 ease-in-out">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`
              bg-transparent outline-none w-full tracking-wide
              ${isHighAccessibility 
                ? 'text-white text-xl placeholder-white/90 font-medium' // Larger, higher contrast
                : 'text-[#E8F1F2] text-base placeholder-[#B8D8D8]/70 font-normal'
              }
            `}
            autoFocus
          />
        ) : (
          <div className={`
            cursor-pointer transform transition-all duration-300
            ${isHighAccessibility
              ? 'text-white text-xl font-medium' // Larger, higher contrast
              : 'text-[#B8D8D8] text-base font-normal'
            }
          `}>
            {value || placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableField;




/*<label className="mr-2">Enter Your Location:</label>
          <input 
            type="text" 
            className="flex-1 border-2 border-gray-300 p-1 rounded focus:outline-none focus:border-blue-500" 
            placeholder="Enter your location here: "
          />



          <label className="mr-2">Enter Your Age:</label>
          <input 
            type="number" 
            className="flex-1 border-2 border-gray-300 p-1 rounded focus:outline-none focus:border-green-500" 
            placeholder="Type age here"
          />*/