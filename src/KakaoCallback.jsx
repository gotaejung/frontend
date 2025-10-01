import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleKakaoCallback(code);
    }
  }, [searchParams]);

  const handleKakaoCallback = async (code) => {
    const client_id = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const client_secret = import.meta.env.VITE_KAKAO_CLIENT_SECRET;
    
    try {
      // 1. 액세스 토큰 요청
      const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        code: code,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const { access_token } = tokenResponse.data;

      // 2. 사용자 정보 요청
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });

      // 3. 로그인 성공 처리
      const userInfo = userResponse.data;
      localStorage.setItem('kakao_token', access_token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      
      // 메인 페이지로 리다이렉트
      navigate('/');
      
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      navigate('/'); // 오류 시에도 메인 페이지로
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black text-white grid place-items-center">
      <p>로그인 처리중...</p>
    </div>
  );
};

export default KakaoCallback;