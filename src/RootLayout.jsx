import { Link } from "react-router";
import { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <Outlet />
      </main>
      <Chatbot />
    </>
  );
}

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인 (localStorage에서 토큰이나 사용자 정보 확인)
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('access_token') || 
                   localStorage.getItem('naver_token') || 
                   localStorage.getItem('kakao_token') ||
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('token') || 
                   localStorage.getItem('userToken');
      const userInfo = localStorage.getItem('user_info') || 
                      localStorage.getItem('userInfo') || 
                      localStorage.getItem('user');
      setIsLoggedIn(!!(token || userInfo));
    };

    checkLoginStatus();
    
    // storage 변경 감지
    window.addEventListener('storage', checkLoginStatus);
    // 커스텀 이벤트로 로그인 상태 변경 감지
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user_info');
    localStorage.removeItem('user');
    localStorage.removeItem('naver_token');
    localStorage.removeItem('kakao_token');
    
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
    
    setIsLoggedIn(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full py-3 md:py-4 px-2 bg-black/90 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src="./logo.svg" alt="Logo" className="w-32 md:w-50" />
          </Link>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <Link
            to="/search"
            className="hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="/search.svg"
              alt="검색"
              className="w-6 h-6 md:w-8 md:h-8"
            />
          </Link>
          
          {/* 마이페이지 링크 - 로그인시에만 표시 */}
          {isLoggedIn && (
            <Link
              to="/mypage"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src="/mypage.svg"
                alt="마이페이지"
                className="w-7 h-7 md:w-9 md:h-9"
              />
            </Link>
          )}
          
          {/* 로그인/로그아웃 버튼 */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-amber-100 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold transition-colors duration-300 text-sm md:text-base"
            > 
              로그아웃 
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-amber-100 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold transition-colors duration-300 text-sm md:text-base"
            > 
              로그인 
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


