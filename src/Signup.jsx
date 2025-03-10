import { useState } from "react"

const Signup = ({ onClose, switchView }) => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      location: "",
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: 기본정보, 2: 위치정보, 3: 동의

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }

    const validateStep1 = () => {
      if (!formData.email) {
        setError("이메일을 입력해주세요.")
        return false
      }
      if (!formData.password) {
        setError("비밀번호를 입력해주세요.")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.")
        return false
      }
      if (!formData.nickname) {
        setError("닉네임을 입력해주세요.")
        return false
      }
      return true
    }

    const validateStep2 = () => {
      if (!formData.location) {
        setError("위치 정보를 입력해주세요.")
        return false
      }
      return true
    }

    const validateStep3 = () => {
      if (!formData.agreeTerms || !formData.agreePrivacy) {
        setError("필수 약관에 동의해주세요.")
        return false
      }
      return true
    }

    const handleNextStep = () => {
      setError("")

      if (step === 1 && validateStep1()) {
        setStep(2)
      } else if (step === 2 && validateStep2()) {
        setStep(3)
      }
    }

    const handlePrevStep = () => {
      setStep((prevStep) => Math.max(1, prevStep - 1))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError("")

      if (!validateStep3()) {
        return
      }

      setLoading(true)

      try {
        // Replace with your actual API endpoint
        const response = await axios.post("/api/signup", formData)

        // Automatically log in the user
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        // Close modal and refresh page
        onClose()
        window.location.reload()
      } catch (err) {
        setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center p-4 border-b">
            <button onClick={step === 1 ? onClose : handlePrevStep} className="text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">회원가입</h1>
            <div className="w-6"></div> {/* Empty div for flex alignment */}
          </div>
        </div>

        <div className="p-6 max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={w-[30%] h-1 rounded-full ${step >= num ? "bg-orange-500" : "bg-gray-200"}}
                />
              ))}
            </div>
            <h2 className="text-xl font-bold">
              {step === 1 && "기본 정보 입력"}
              {step === 2 && "위치 정보 설정"}
              {step === 3 && "약관 동의"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {step === 1 && "좋은거래에서 사용할 기본 정보를 입력해주세요"}
              {step === 2 && "주 거래 지역을 설정해주세요"}
              {step === 3 && "서비스 이용을 위한 약관에 동의해주세요"}
            </p>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Step 1: 기본 정보 */}
            {step === 1 && (
              <div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="이메일 주소를 입력하세요"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="영문, 숫자 포함 8자 이상"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="다른 사용자에게 보여질 이름"
                  />
                </div>
              </div>
            )}

            {/* Step 2: 위치 정보 */}
            {step === 2 && (
              <div>
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    거래 지역
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="예: 서울시 강남구 신사동"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    위치 정보는 주변의 상품과 동네 소식을 보여주는 데 사용됩니다.
                  </p>
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200"
                  >
                    현재 위치로 설정하기
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: 약관 동의 */}
            {step === 3 && (
              <div>
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="agreeAll"
                      checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                      onChange={() => {
                        const allChecked = formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing
                        setFormData((prev) => ({
                          ...prev,
                          agreeTerms: !allChecked,
                          agreePrivacy: !allChecked,
                          agreeMarketing: !allChecked,
                        }))
                      }}
                      className="h-4 w-4 text-orange-500"
                    />
                    <label htmlFor="agreeAll" className="ml-2 block text-gray-900 font-medium">
                      전체 동의
                    </label>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500"
                      />
                      <label htmlFor="agreeTerms" className="ml-2 block text-gray-900">
                        <span className="text-orange-500">[필수]</span> 이용약관 동의
                      </label>
                      <button type="button" className="ml-auto text-sm text-gray-500">
                        보기
                      </button>
                    </div>

                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="agreePrivacy"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500"
                      />
                      <label htmlFor="agreePrivacy" className="ml-2 block text-gray-900">
                        <span className="text-orange-500">[필수]</span> 개인정보 처리방침 동의
                      </label>
                      <button type="button" className="ml-auto text-sm text-gray-500">
                        보기
                      </button>
                    </div>

                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="agreeMarketing"
                        name="agreeMarketing"
                        checked={formData.agreeMarketing}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500"
                      />
                      <label htmlFor="agreeMarketing" className="ml-2 block text-gray-900">
                        <span className="text-gray-500">[선택]</span> 마케팅 정보 수신 동의
                      </label>
                      <button type="button" className="ml-auto text-sm text-gray-500">
                        보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200"
                >
                  다음
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200"
                >
                  {loading ? "처리 중..." : "가입 완료"}
                </button>
              )}
            </div>

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  이미 계정이 있으신가요?
                  <button onClick={() => switchView("login")} className="text-orange-500 ml-1 font-medium">
                    로그인
                  </button>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }
  export default Signup;