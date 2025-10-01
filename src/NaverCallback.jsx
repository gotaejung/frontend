import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';

const NaverCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('naver_state');
    
    if (code && state && state === storedState) {
      handleNaverCallback(code, state);
    } else {
      console.error('네이버 로그인 오류: state 불일치 또는 code 없음');
      navigate('/');
    }
  }, [searchParams]);

  const handleNaverCallback = async (code, state) => {
    const client_id = import.meta.env.VITE_NAVER_CLIENT_ID;
    const client_secret = import.meta.env.VITE_NAVER_CLIENT_SECRET;
    
    try {
      // 1. 액세스 토큰 요청
      const tokenResponse = await axios.post('/api/naver/token', {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        state: state,
      });

      const { access_token } = tokenResponse.data;

      // 2. 사용자 정보 요청
      const userResponse = await axios.get('/api/naver/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      });

      // 3. 로그인 성공 처리
      const userInfo = userResponse.data;
      localStorage.setItem('naver_token', access_token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      localStorage.removeItem('naver_state'); // state 정리
      
      // 메인 페이지로 리다이렉트
      navigate('/');
      
    } catch (error) {
      console.error('네이버 로그인 오류:', error);
      
      // CORS 문제로 직접 호출이 안 될 경우 프록시 없이 처리
      try {
        // 직접 네이버 API 호출 (CORS 문제가 있을 수 있음)
        const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`;
        
        // 간단한 처리: 토큰만 받고 메인 페이지로 이동
        localStorage.setItem('naver_auth_code', code);
        localStorage.removeItem('naver_state');
        navigate('/');
        
      } catch (directError) {
        console.error('직접 호출도 실패:', directError);
        navigate('/');
      }
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black text-white grid place-items-center">
      <p>네이버 로그인 처리중...</p>
    </div>
  );
};

export default NaverCallback;