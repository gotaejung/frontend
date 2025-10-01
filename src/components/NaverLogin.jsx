import { useEffect } from 'react';

const NaverLogin = () => {
  useEffect(() => {
    // Naver SDK 로드
    if (!window.naver) {
      const script = document.createElement('script');
      script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initNaverLogin();
      };
    } else {
      initNaverLogin();
    }
  }, []);

  const initNaverLogin = () => {
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false,
        loginButton: { color: 'green', type: 1, height: 40 }
      });
      naverLogin.init();
    }
  };

  const handleNaverLogin = () => {
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false
      });
      naverLogin.init();
      naverLogin.login();
    }
  };

  return (
    <button
      onClick={handleNaverLogin}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
    >
      <span>🟢</span>
      네이버 로그인
    </button>
  );
};

export default NaverLogin;