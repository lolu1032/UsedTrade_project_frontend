import { useState } from "react"
import Login from "./login"

const SideMenu = ({ isOpen, onClose }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  // 로그인 창 열기
  const openLogin = () => {
    setIsLoginOpen(true)
    setIsSignupOpen(false)
  }

  // 회원가입 창 열기
  const openSignup = () => {
    setIsSignupOpen(true)
    setIsLoginOpen(false)
  }

  // 로그인 또는 회원가입 창 닫기
  const closeAuth = () => {
    setIsLoginOpen(false)
    setIsSignupOpen(false)
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4 border-b">
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* 로그인 버튼 */}
          <div className="flex items-center space-x-3 mb-6 p-2 cursor-pointer" onClick={openLogin}>
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">로그인/회원가입</p>
              <p className="text-sm text-gray-500">계정을 만들어 보세요</p>
            </div>
          </div>

          {/* 메뉴 리스트 */}
          <ul>
            {["홈", "내 근처", "채팅", "관심목록", "나의 좋은거래", "동네생활", "중고거래 인증", "알림", "설정"].map((name, index) => (
              <li key={index} className="py-3 border-b">
                <a href="#" className="flex items-center">
                  <div className="w-6 h-6 mr-4"></div>
                  <span>{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 로그인 창 */}
      {isLoginOpen && <Login onClose={closeAuth} switchView={openSignup} />}

      {/* 회원가입 창 */}
      {isSignupOpen && <Signup onClose={closeAuth} switchView={openLogin} />}
    </>
  )
}

export default SideMenu
