import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 인증 코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('카카오 로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
      navigate('/');
      return;
    }

    if (code) {
      // 백엔드로 인증 코드 전송하여 토큰 받기
      handleKakaoCallback(code);
    } else {
      console.error('인증 코드가 없습니다.');
      navigate('/');
    }
  }, [navigate]);

  const handleKakaoCallback = async (code) => {
    try {
      // 백엔드 API 호출 (실제 구현 시 백엔드 URL로 변경)
      const response = await fetch('/api/auth/kakao/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const data = await response.json();
        
        // 토큰 저장
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
                
        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));

        ('카카오 로그인 성공:', data);
        navigate('/');
      } else {
        throw new Error('로그인 처리 중 오류 발생');
      }
    } catch (error) {
      console.error('카카오 콜백 처리 오류:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p>카카오 로그인 처리중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;