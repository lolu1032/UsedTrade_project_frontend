"use client"

import { useState, useEffect } from "react"

const LocationSelector = ({ onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [location, setLocation] = useState("강남구")
  const [fullLocation, setFullLocation] = useState("서울특별시, 강남구")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showingSearchResults, setShowingSearchResults] = useState(false)

  // Basic recommended locations
  const recommendedLocations = [
    { id: 1, name: "서울특별시, 강남구" },
    { id: 2, name: "서울특별시, 송파구" },
    { id: 3, name: "경기도, 부천시" },
    { id: 4, name: "경기도, 화성시" },
    { id: 5, name: "서울특별시, 강서구" },
    { id: 6, name: "인천광역시, 서구" },
  ]

  // City district mapping (for search functionality)
  const cityDistrictMap = {
    인천: [
      "인천광역시, 서구",
      "인천광역시, 남구",
      "인천광역시, 동구",
      "인천광역시, 중구",
      "인천광역시, 연수구",
      "인천광역시, 부평구",
      "인천광역시, 계양구",
      "인천광역시, 미추홀구",
    ],
    서울: [
      "서울특별시, 강남구",
      "서울특별시, 송파구",
      "서울특별시, 강서구",
      "서울특별시, 강동구",
      "서울특별시, 마포구",
      "서울특별시, 용산구",
      "서울특별시, 종로구",
      "서울특별시, 중구",
    ],
    수원: ["경기도, 수원시 권선구", "경기도, 수원시 영통구", "경기도, 수원시 장안구", "경기도, 수원시 팔달구"],
  }

  // Neighborhood mapping (for more specific locations)
  const districtNeighborhoodMap = {
    "수원시 권선구": [
      "경기도, 수원시 권선구, 권선2동",
      "경기도, 수원시 권선구, 권선1동",
      "경기도, 수원시 권선구, 권선동",
      "경기도, 수원시 권선구, 곡선동",
      "경기도, 수원시 권선구, 구선동",
    ],
    송파구: [
      "서울특별시, 송파구, 잠실동",
      "서울특별시, 송파구, 방이동",
      "서울특별시, 송파구, 오금동",
      "서울특별시, 송파구, 송파동",
      "서울특별시, 송파구, 가락동",
    ],
    강남구: [
      "서울특별시, 강남구, 역삼동",
      "서울특별시, 강남구, 삼성동",
      "서울특별시, 강남구, 청담동",
      "서울특별시, 강남구, 논현동",
      "서울특별시, 강남구, 압구정동",
    ],
  }

  // Toggle location modal
  const toggleLocationModal = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm("")
      setSearchResults(recommendedLocations)
      setShowingSearchResults(false)
    }
  }

  // Close modal when clicking outside
  const handleClickOutside = (event) => {
    if (event.target.closest(".location-modal-content")) return
    setIsOpen(false)
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim()) {
      setShowingSearchResults(true)

      // Check if searching for a city
      const cityKey = Object.keys(cityDistrictMap).find((city) => city.includes(term) || term.includes(city))

      if (cityKey) {
        // If searching for a city, show all districts in that city
        setSearchResults(cityDistrictMap[cityKey].map((name, id) => ({ id, name })))
      } else {
        // Check if searching for a district
        const districtKey = Object.keys(districtNeighborhoodMap).find(
          (district) => district.includes(term) || term.includes(district),
        )

        if (districtKey) {
          // If searching for a district, show all neighborhoods in that district
          setSearchResults(districtNeighborhoodMap[districtKey].map((name, id) => ({ id, name })))
        } else {
          // General search across all locations
          const allLocations = [
            ...recommendedLocations,
            ...Object.values(cityDistrictMap)
              .flat()
              .map((name, id) => ({ id: id + 100, name })),
            ...Object.values(districtNeighborhoodMap)
              .flat()
              .map((name, id) => ({ id: id + 200, name })),
          ]

          const filtered = allLocations.filter((loc) => loc.name.toLowerCase().includes(term.toLowerCase()))

          // Remove duplicates
          const uniqueFiltered = filtered.filter(
            (loc, index, self) => index === self.findIndex((t) => t.name === loc.name),
          )

          setSearchResults(uniqueFiltered)
        }
      }
    } else {
      setSearchResults(recommendedLocations)
      setShowingSearchResults(false)
    }
  }

  // Select a location from the list
  const selectLocation = (locationName) => {
    setFullLocation(locationName)
    // Extract the district or neighborhood name from the full location
    const parts = locationName.split(",")
    const lastPart = parts[parts.length - 1].trim()

    // If it's a neighborhood (contains 동), use that, otherwise use the district (구)
    if (lastPart.includes("동")) {
      setLocation(lastPart)
    } else {
      const districtMatch = locationName.match(/([가-힣]+구|[가-힣]+시)(?![가-힣])/) || []
      const district = districtMatch[0] || parts[parts.length - 1].trim()
      setLocation(district)
    }

    // Call the parent component's location change handler
    if (onLocationChange) {
      onLocationChange(locationName)
    }

    setIsOpen(false)
  }

  // Use current location with GPS
  const useCurrentLocation = () => {
    setIsLoading(true)

    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
        if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // In a real app, you would use reverse geocoding API with these coordinates
              const { latitude, longitude } = position.coords

              // Simulate API call for reverse geocoding
              setTimeout(() => {
                // Simulate getting nearby neighborhoods based on location
                // In a real app, this would come from a geocoding service
                const nearbyNeighborhoods = [
                  "경기도, 수원시 권선구, 권선2동",
                  "경기도, 수원시 권선구, 권선1동",
                  "경기도, 수원시 권선구, 권선동",
                  "경기도, 수원시 권선구, 곡선동",
                ]

                setSearchResults(nearbyNeighborhoods.map((name, id) => ({ id, name })))
                setShowingSearchResults(true)
                setIsLoading(false)
              }, 1000)

              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
            },
            (error) => {
              console.error("Error getting location:", error)
              alert("위치 정보를 가져오는데 실패했습니다.")
              setIsLoading(false)
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
          )
        } else {
          alert("위치 서비스 권한이 필요합니다.")
          setIsLoading(false)
        }
      })
    } else {
      alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.")
      setIsLoading(false)
    }
  }

  // Initialize search results
  useEffect(() => {
    setSearchResults(recommendedLocations)
  }, [])

  // Add event listener for outside clicks
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative">
      {/* Location button that triggers modal */}
      <div
        className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm cursor-pointer shadow-sm hover:bg-gray-200 transition-colors"
        onClick={toggleLocationModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">{location}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Location selection modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-start justify-center">
          <div className="location-modal-content bg-white w-full max-w-md rounded-lg overflow-hidden shadow-xl mt-16">
            {/* Modal header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">지역 변경</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search box */}
            <div className="p-4">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="지역이나 동네로 검색하기"
                  className="flex-grow p-2.5 outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="px-3 bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Current location button */}
            <button
              onClick={useCurrentLocation}
              className="w-full p-3.5 text-center bg-orange-100 text-orange-500 font-medium flex items-center justify-center hover:bg-orange-200 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full mr-2"></div>
                  <span>위치 정보 가져오는 중...</span>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  현재 내 위치 사용하기
                </>
              )}
            </button>

            {/* Location list */}
            <div className="max-h-96 overflow-y-auto">
              <h3 className="p-3 text-sm font-semibold text-blue-600">
                {showingSearchResults ? (searchTerm ? "검색 결과" : "주변") : "추천"}
              </h3>
              <ul className="divide-y divide-gray-100">
                {searchResults.map((location, index) => (
                  <li
                    key={location.id || index}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => selectLocation(location.name)}
                  >
                    {location.name}
                  </li>
                ))}
                {searchResults.length === 0 && <li className="p-3 text-gray-500 text-center">검색 결과가 없습니다.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationSelector

