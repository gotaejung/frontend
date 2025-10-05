import { useEffect, useRef } from 'react';

const NaverLogin = () => {
  const naverRef = useRef(null);

  useEffect(() => {
    // Naver SDK 로드
    if (!window.naver) {
      const script = document.createElement('script');
      script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        setTimeout(() => initNaverLogin(), 100); // 약간의 지연 추가
      };
    } else {
      setTimeout(() => initNaverLogin(), 100);
    }
  }, []);

  const initNaverLogin = () => {
    if (window.naver && naverRef.current) {
      try {
        const naverLogin = new window.naver.LoginWithNaverId({
          clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
          callbackUrl: `${window.location.origin}/auth/naver/callback`,
          isPopup: false,
          loginButton: { color: 'green', type: 1, height: 40 },
          callbackHandle: true
        });
        naverLogin.init();
      } catch (error) {
        console.warn('네이버 로그인 초기화 오류:', error);
      }
    }
  };

  const handleNaverLogin = () => {
    if (window.naver) {
      try {
        // 직접 로그인 URL로 리다이렉트
        const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/auth/naver/callback`);
        const state = Math.random().toString(36).substring(2, 15);
        
        const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
        
        window.location.href = naverLoginUrl;
      } catch (error) {
        console.error('네이버 로그인 오류:', error);
      }
    }
  };

  return (
    <div>
      {/* 네이버 SDK가 필요로 하는 숨겨진 요소 */}
      <div ref={naverRef} id="naverIdLogin" style={{ display: 'none' }}></div>
      
      {/* 커스텀 로그인 버튼 */}
      <img
        src="/naver_login.svg"
        alt="네이버 로그인"
        onClick={handleNaverLogin}
        className="w-full cursor-pointer hover:opacity-80 transition-opacity duration-300"
      />
    </div>
  );
};

export default NaverLogin;