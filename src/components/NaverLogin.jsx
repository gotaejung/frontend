import { useRef } from "react";

const NaverLogin = () => {
  const naverRef = useRef();

  const handleNaverLogin = () => {
    if (window.naver) {
      try {
        const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
        const redirectUri = encodeURIComponent(
          `${window.location.origin}/auth/naver/callback`
        );
        const state = Math.random().toString(36).substring(2, 15);

        const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

        window.location.href = naverLoginUrl;
      } catch (error) {
        console.error("네이버 로그인 오류:", error);
      }
    }
  };

  return (
    <div>
      {/* 네이버 SDK가 필요로 하는 숨겨진 요소 */}
      <div ref={naverRef} id="naverIdLogin" style={{ display: "none" }}></div>

      {/* 커스텀 로그인 버튼 */}
      <img
        src="/naver_login.svg"
        alt="네이버 로그인"
        onClick={handleNaverLogin}
        className="w-full cursor-pointer hover:opacity-80 transition-opacity duration-300"
      />
    </div>
  );
};

export default NaverLogin;
