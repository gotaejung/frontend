import { useEffect } from 'react';

const KakaoLogin = () => {
  useEffect(() => {
    // Kakao SDK 로드
    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_CLIENT_ID);
        }
      };
    }
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.login({
        success: (response) => {
          ('카카오 로그인 성공:', response);
          // 사용자 정보 요청
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              ('사용자 정보:', res);
              // 로그인 성공 후 처리
              localStorage.setItem('kakao_token', response.access_token);
              localStorage.setItem('user_info', JSON.stringify(res));
              window.location.href = '/';
            },
            fail: (error) => {
              console.error('사용자 정보 요청 실패:', error);
            }
          });
        },
        fail: (error) => {
          console.error('카카오 로그인 실패:', error);
        }
      });
    }
  };

  return (
    <img
      src="/kakao_login.svg"
      alt="카카오 로그인"
      onClick={handleKakaoLogin}
      className="w-full cursor-pointer hover:opacity-80 transition-opacity duration-300"
    />
  );
};

export default KakaoLogin;