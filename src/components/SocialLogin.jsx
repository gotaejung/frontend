import { useState, useEffect } from 'react';
import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';

const SocialLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    const kakaoToken = localStorage.getItem('kakao_token');
    const naverToken = localStorage.getItem('naver_token');
    const accessToken = localStorage.getItem('access_token');
    const savedUserInfo = localStorage.getItem('user_info');

    if ((kakaoToken || naverToken || accessToken) && savedUserInfo) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    // 카카오 로그아웃
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(() => {
        ('카카오 로그아웃 완료');
      });
    }

    // 네이버 로그아웃
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false
      });
      naverLogin.init();
      naverLogin.logout();
    }

    // 로컬 스토리지 정리
    localStorage.removeItem('kakao_token');
    localStorage.removeItem('naver_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');

    setIsLoggedIn(false);
    setUserInfo(null);
    
    // 페이지 새로고침
    window.location.reload();
  };

  if (isLoggedIn && userInfo) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {userInfo.profile_image && (
            <img 
              src={userInfo.profile_image} 
              alt="프로필" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-white text-sm">
            {userInfo.nickname || userInfo.name || '사용자'}님
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-300"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <KakaoLogin />
      <NaverLogin />
    </div>
  );
};

export default SocialLogin;