import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCrown, 
  faShield, 
  faHeadset,
  faHistory,
  faHeart,
  faStar,
  faGem,
  faExchangeAlt,
  faCreditCard,
  faFileInvoice,
  faKey,
  faEnvelope,
  faPhone,
  faDesktop,
  faPaperPlane,
  faQuestionCircle,
  faChevronRight,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

export default function MyPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const menuData = {
    account: {
      title: "계정",
      icon: faUser,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      items: [
        { id: 'watchHistory', title: '시청기록', icon: faHistory, description: '최근 시청한 콘텐츠를 확인하세요' },
        { id: 'wishlist', title: '찜한콘텐츠', icon: faHeart, description: '나중에 볼 영화와 드라마 목록' },
        { id: 'reviews', title: '내 리뷰관리', icon: faStar, description: '작성한 리뷰를 관리하세요' }
      ]
    },
    membership: {
      title: "멤버십",
      icon: faCrown,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      items: [
        { id: 'membershipType', title: '멤버십 유형', icon: faGem, description: '현재 이용 중인 멤버십 정보' },
        { id: 'changeMembership', title: '멤버십 변경', icon: faExchangeAlt, description: '멤버십 플랜을 변경하세요' },
        { id: 'paymentInfo', title: '결제정보', icon: faCreditCard, description: '등록된 결제 수단 관리' },
        { id: 'paymentHistory', title: '결제내역 확인', icon: faFileInvoice, description: '과거 결제 내역을 확인하세요' }
      ]
    },
    security: {
      title: "보안",
      icon: faShield,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      items: [
        { id: 'password', title: '비밀번호', icon: faKey, description: '비밀번호를 변경하세요' },
        { id: 'email', title: '이메일', icon: faEnvelope, description: '이메일 주소를 관리하세요' },
        { id: 'phone', title: '휴대폰', icon: faPhone, description: '휴대폰 번호를 관리하세요' },
        { id: 'devices', title: '액세스 디바이스', icon: faDesktop, description: '로그인된 기기를 관리하세요' }
      ]
    },
    support: {
      title: "고객센터",
      icon: faHeadset,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      items: [
        { id: 'feedback', title: '의견보내기', icon: faPaperPlane, description: '서비스 개선을 위한 의견을 보내주세요' },
        { id: 'faq', title: '자주묻는 질문', icon: faQuestionCircle, description: '궁금한 점을 빠르게 해결하세요' }
      ]
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleItemClick = (categoryId, itemId) => {
    console.log(`${categoryId} - ${itemId} 클릭됨`);
    // 여기에 각 항목별 상세 페이지 로직 추가 가능
  };

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-100">마이 페이지</h1>
          <p className="text-gray-400 text-lg">계정 설정 및 서비스 관리</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-2xl text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-100">사용자님</h2>
              <p className="text-amber-200/80">프리미엄 멤버</p>
              <p className="text-sm text-gray-400">가입일: 2024.01.15</p>
            </div>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className="grid gap-6">
          {Object.entries(menuData).map(([categoryId, category]) => (
            <div key={categoryId} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              {/* 카테고리 헤더 */}
              <button
                onClick={() => handleCategoryClick(categoryId)}
                className={`w-full p-6 flex items-center justify-between transition-all duration-300 hover:bg-gray-800/50 ${
                  activeCategory === categoryId ? category.bgColor : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} ${category.borderColor} border flex items-center justify-center`}>
                    <FontAwesomeIcon icon={category.icon} className={`text-xl ${category.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                    <p className="text-sm text-gray-400">{category.items.length}개 항목</p>
                  </div>
                </div>
                <FontAwesomeIcon 
                  icon={activeCategory === categoryId ? faChevronDown : faChevronRight} 
                  className={`text-lg transition-transform duration-300 ${category.color}`}
                />
              </button>

              {/* 서브메뉴 */}
              <div className={`transition-all duration-300 overflow-hidden ${
                activeCategory === categoryId ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-t border-gray-800">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(categoryId, item.id)}
                      className="w-full p-4 flex items-center space-x-4 hover:bg-gray-800/30 transition-colors duration-200 border-b border-gray-800/50 last:border-b-0"
                    >
                      <div className={`w-10 h-10 rounded-lg ${category.bgColor} ${category.borderColor} border flex items-center justify-center`}>
                        <FontAwesomeIcon icon={item.icon} className={`text-sm ${category.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-gray-500 text-sm"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-900/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-amber-100">서비스 이용</h3>
              <p className="text-3xl font-bold text-amber-400 mb-2">156</p>
              <p className="text-sm text-gray-400">시청한 영화</p>
            </div>
            <div className="bg-gray-900/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-amber-100">찜한 콘텐츠</h3>
              <p className="text-3xl font-bold text-amber-400 mb-2">24</p>
              <p className="text-sm text-gray-400">저장된 영화</p>
            </div>
            <div className="bg-gray-900/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-amber-100">작성한 리뷰</h3>
              <p className="text-3xl font-bold text-amber-400 mb-2">8</p>
              <p className="text-sm text-gray-400">총 리뷰 수</p>
            </div>
          </div>
        </div>

        {/* 빠른 액션 버튼들 */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors">
            프로필 편집
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors">
            멤버십 업그레이드
          </button>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}