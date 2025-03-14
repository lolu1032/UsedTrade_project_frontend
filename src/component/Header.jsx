// components/marketplace/Header.js
import LocationSelector from "./LocationSelector"

const Header = ({ onMenuClick, onLocationChange }) => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <span className="text-orange-500 font-bold text-xl">좋은거래</span>
      </div>
      <div className="flex">
        <LocationSelector onLocationChange={onLocationChange} />
        <div className="flex items-center space-x-2 px-4 py-2">
          <button className="text-2xl" onClick={onMenuClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header