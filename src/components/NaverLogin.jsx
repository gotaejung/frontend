import { useRef } from "react";

const NaverLogin = () => {
  const naverRef = useRef();

  const handleNaverLogin = () => {
    ("네이버 로그인 버튼 클릭됨");
    
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    ("Client ID:", clientId ? "설정됨" : "설정되지 않음");
    
    if (!clientId) {
      console.error("네이버 클라이언트 ID가 설정되지 않았습니다.");
      alert("네이버 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.");
      return;
    }
    
    try {
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/auth/naver/callback`
      );
      ("Redirect URI:", redirectUri);
      const state = Math.random().toString(36).substring(2, 15);

      const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      
      ("네이버 로그인 URL:", naverLoginUrl);
      window.location.href = naverLoginUrl;
    } catch (error) {
      console.error("네이버 로그인 오류:", error);
      alert("네이버 로그인 중 오류가 발생했습니다: " + error.message);
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
