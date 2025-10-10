import KakaoLogin from "./KakaoLogin";
import NaverLogin from "./NaverLogin";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 로그인 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-100">
              로그인
            </h1>
            <p className="text-gray-300 text-lg">
              소셜 계정으로 간편하게 로그인하세요
            </p>
          </div>

          {/* 로그인 버튼들 */}
          <div className="space-y-4">
            {/* 카카오 로그인 */}
            <div className="w-full">
              <div className="w-full">
                <KakaoLogin />
              </div>
            </div>

            {/* 네이버 로그인 */}
            <div className="w-full">
              <div className="w-full">
                <NaverLogin />
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">또는</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* 게스트 로그인 */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-block w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-300"
            >
              게스트로 계속하기
            </Link>
          </div>

          {/* 안내 텍스트 */}
          <div className="mt-8 text-center">
            {/* <p className="text-gray-400 text-sm">
              로그인하시면 개인화된 영화 추천과 <br />
              즐겨찾기 기능을 이용하실 수 있습니다.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}