// components/marketplace/LocationSelector.js
import { useState } from 'react'

const LocationSelector = ({ onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("서울시 강남구 신사동")
  
  const locations = [
    "서울특별시, 강남구, 신사동",
    "서울특별시, 강남구, 논현동",
    "서울특별시, 강남구, 압구정동",
    "서울특별시, 강남구, 청담동",
    "서울특별시, 서초구, 서초동",
    "서울특별시, 서초구, 반포동",
    "서울특별시, 서초구, 방배동",
    "서울특별시, 송파구, 잠실동",
    "서울특별시, 송파구, 석촌동",
    "서울특별시, 송파구, 가락동"
  ]

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    onLocationChange(location)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {selectedLocation.split(" ")[1]}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-1 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-50">
          <div className="py-2 max-h-64 overflow-y-auto">
            {locations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationSelector