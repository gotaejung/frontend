import { useEffect } from 'react';

const NaverLogin = () => {
  const client_id = import.meta.env.VITE_NAVER_CLIENT_ID;
  const redirect_uri = import.meta.env.VITE_NAVER_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 11); // CSRF 방지용 랜덤 state
  
  const handleNaverLogin = () => {
    // 네이버 로그인 URL 생성
    const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`;
    
    // state 값을 로컬 스토리지에 저장 (콜백에서 검증용)
    localStorage.setItem('naver_state', state);
    
    window.location.href = naverURL;
  };

  return (
    <button
      onClick={handleNaverLogin}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-bold"
    >
      네이버 로그인
    </button>
  );
};

export default NaverLogin;