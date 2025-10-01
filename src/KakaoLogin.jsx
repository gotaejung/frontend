import { useEffect } from 'react';

const KakaoLogin = () => {
  const client_id = import.meta.env.VITE_KAKAO_CLIENT_ID; // 카카오 JavaScript 키
  const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI; // 등록한 리다이렉트 URI
  
  const handleKakaoLogin = () => {
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors duration-300 font-bold"
    >
      카카오 로그인
    </button>
  );
};

export default KakaoLogin;