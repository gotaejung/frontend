import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 인증 코드와 state 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      console.error('네이버 로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
      navigate('/');
      return;
    }

    if (code) {
      // 백엔드로 인증 코드 전송하여 토큰 받기
      handleNaverCallback(code, state);
    } else {
      // 네이버 SDK를 통한 콜백 처리 (fallback)
      loadNaverSDKAndProcess();
    }
  }, [navigate]);

  const handleNaverCallback = async (code, state) => {
    try {
      // 실제 환경에서는 백엔드 API를 호출해야 합니다
      ('네이버 인증 코드:', code);
      
      // 임시로 로그인 성공 처리
      const tempUserInfo = {
        id: 'naver_user_' + Date.now(),
        name: '네이버 사용자',
        nickname: '네이버 사용자',
        provider: 'naver'
      };
      
      localStorage.setItem('naver_token', 'temp_naver_token');
      localStorage.setItem('user_info', JSON.stringify(tempUserInfo));
            
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new CustomEvent('loginStatusChanged'));

      ('네이버 로그인 성공');
      navigate('/');
    } catch (error) {
      console.error('네이버 콜백 처리 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  const loadNaverSDKAndProcess = () => {
    if (window.naver) {
      processNaverLogin();
    } else {
      const script = document.createElement('script');
      script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
      script.onload = () => {
        setTimeout(() => processNaverLogin(), 500);
      };
      document.head.appendChild(script);
    }
  };

  const processNaverLogin = () => {
    try {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false
      });
      
      naverLogin.init();
      
      naverLogin.getLoginStatus((status) => {
        if (status) {
          const user = naverLogin.user;
          
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
                    
          // 로그인 상태 변경 이벤트 발생
          window.dispatchEvent(new CustomEvent('loginStatusChanged'));

          ('네이버 로그인 성공:', userInfo);
          navigate('/');
        } else {
          console.error('네이버 로그인 실패');
          alert('로그인에 실패했습니다.');
          navigate('/');
        }
      });
    } catch (error) {
      console.warn('네이버 SDK 처리 오류:', error);
      navigate('/');
    }
  };

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