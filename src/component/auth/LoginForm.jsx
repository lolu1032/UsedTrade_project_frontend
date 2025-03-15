import { useState } from 'react';

const LoginForm = ({ onClose, switchView }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }
      
      // Assuming the response contains accessToken and username
      const data = await response.json();
      
      // Store in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('username', data.username);
      
      // Notify parent components about successful login
      window.dispatchEvent(new Event('user-login'));
      
      alert("로그인 성공");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">로그인</h2>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-md font-medium mb-4">
            로그인
          </button>

          <div className="flex justify-center mb-4">
            <button type="button" className="text-sm text-gray-500">
              이메일/비밀번호 찾기
            </button>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-500">또는</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          <div className="space-y-2">
            <button type="button" className="w-full py-3 border border-gray-300 rounded-md flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                />
                <path
                  fill="#34A853"
                  d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078-3.776 0-6.973-2.54-8.117-5.952L0 16.508C2.286 20.591 6.704 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                />
                <path
                  fill="#4A90E2"
                  d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.883 13.139c-.289-.868-.445-1.79-.445-2.741 0-.951.156-1.873.445-2.741L0 4.508C.298 2.67 1.063 1 2.146 0L6.43 3.317c1.143-3.413 4.34-5.956 8.116-5.956 1.565 0 2.95.376 4.04 1.08l-3.793 2.987C13.831 1.027 10.72 2.094 9 4.908L3.883 13.139Z"
                />
              </svg>
              Google로 계속하기
            </button>
            <button type="button" className="w-full py-3 border border-gray-300 rounded-md flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.2,11.1c0-3.3-2.6-5.9-5.9-5.9S10.4,7.9,10.4,11.1c0,0.2,0,0.4,0,0.7H2.8c0.3-5.3,4.8-9.5,10.1-9.5c5.6,0,10.2,4.6,10.2,10.2s-4.6,10.2-10.2,10.2c-5.3,0-9.8-4.2-10.1-9.5h7.6c0,0.2,0,0.4,0,0.7c0,3.3,2.6,5.9,5.9,5.9s5.9-2.6,5.9-5.9c0-3.3-2.6-5.9-5.9-5.9S10.4,7.9,10.4,11.1"
                  fill="#000000"
                />
              </svg>
              Apple로 계속하기
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">아직 회원이 아니신가요?</span>
            <button
              type="button"
              onClick={switchView}
              className="text-sm text-orange-500 font-medium ml-2"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;