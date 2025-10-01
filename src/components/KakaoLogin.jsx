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
          console.log('카카오 로그인 성공:', response);
          // 사용자 정보 요청
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              console.log('사용자 정보:', res);
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
    <button
      onClick={handleKakaoLogin}
      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
    >
      <span>🟡</span>
      카카오 로그인
    </button>
  );
};

export default KakaoLogin;