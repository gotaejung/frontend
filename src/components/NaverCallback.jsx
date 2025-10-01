import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 네이버 로그인 콜백 처리
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false
      });
      
      naverLogin.init();
      
      naverLogin.getLoginStatus((status) => {
        if (status) {
          const user = naverLogin.user;
          
          // 사용자 정보 저장
          const userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            profile_image: user.profile_image,
            provider: 'naver'
          };
          
          localStorage.setItem('naver_token', naverLogin.accessToken.accessToken);
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          
          console.log('네이버 로그인 성공:', userInfo);
          navigate('/');
        } else {
          console.error('네이버 로그인 실패');
          alert('로그인에 실패했습니다.');
          navigate('/');
        }
      });
    } else {
      // 네이버 SDK가 로드되지 않은 경우
      console.error('네이버 SDK가 로드되지 않았습니다.');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p>네이버 로그인 처리중...</p>
      </div>
    </div>
  );
};

export default NaverCallback;