import { useState, useEffect } from 'react';

const SideMenu = ({ isOpen, onClose, onLoginClick }) => {
  const [username, setUsername] = useState(null);
  
  const menuItems = [
    { label: "홈", icon: "home" },
    { label: "동네생활", icon: "community" },
    { label: "내 근처", icon: "location" },
    { label: "채팅", icon: "chat" },
    { label: "나의 좋은거래", icon: "user" },
  ];
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Listen for login events
    const handleLogin = () => {
      const updatedUsername = localStorage.getItem('username');
      setUsername(updatedUsername);
    };
    
    window.addEventListener('user-login', handleLogin);
    
    // Cleanup
    return () => {
      window.removeEventListener('user-login', handleLogin);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setUsername(null);
  };

  const renderIcon = (icon) => {
    switch (icon) {
      case "home":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      case "community":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case "location":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case "chat":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      case "user":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Menu panel */}
      <div className="relative w-4/5 max-w-sm bg-white h-full overflow-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              <span className="text-orange-500">좋은거래</span>
            </span>
            <button onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User section - changes based on login status */}
        {username ? (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{username} 님</p>
                <p className="text-sm text-gray-500">반갑습니다</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded-md"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b">
            <p className="text-sm mb-2">좋은거래 서비스를 이용하시려면 로그인이 필요해요</p>
            <div className="flex space-x-2">
              <button 
                onClick={onLoginClick}
                className="flex-1 bg-orange-500 text-white py-2 rounded-md"
              >
                로그인
              </button>
            </div>
          </div>
        )}

        {/* Menu items */}
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-100">
                {renderIcon(item.icon)}
                <span className="ml-3">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;