import axios from "axios";
import { useState } from "react";

const Login = ({ onClose, switchView }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 올바른 응답 처리 방식
      localStorage.setItem("token", response.data.accessToken);
      
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={onClose} className="text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">로그인</h1>
          <div className="w-6"></div> {/* Empty div for flex alignment */}
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <div className="mb-8 text-center">
          <span className="text-orange-500 font-bold text-2xl">좋은거래</span>
          <p className="text-gray-500 mt-2">로그인하고 좋은거래를 시작하세요</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button className="text-sm text-gray-600 hover:text-orange-500">
            비밀번호 찾기
          </button>
          <span className="mx-2 text-gray-500">|</span>
          <button
            onClick={() => switchView("signup")}
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
