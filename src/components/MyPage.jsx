import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function MyPage() {
  const [activeCategory, setActiveCategory] = useState("account");

  const menuData = {
    account: {
      title: "계정",
      icon: faUser,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      items: [
        {
          id: "watchHistory",
          title: "시청기록",
          icon: faHistory,
          description: "최근 시청한 콘텐츠를 확인하세요",
        },
        {
          id: "wishlist",
          title: "찜한콘텐츠",
          icon: faHeart,
          description: "나중에 볼 영화와 드라마 목록",
        },
        {
          id: "reviews",
          title: "내 리뷰관리",
          icon: faStar,
          description: "작성한 리뷰를 관리하세요",
        },
      ],
    },
    membership: {
      title: "멤버십",
      icon: faCrown,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      items: [
        {
          id: "membershipType",
          title: "멤버십 유형",
          icon: faGem,
          description: "현재 이용 중인 멤버십 정보",
        },
        {
          id: "changeMembership",
          title: "멤버십 변경",
          icon: faExchangeAlt,
          description: "멤버십 플랜을 변경하세요",
        },
        {
          id: "paymentInfo",
          title: "결제정보",
          icon: faCreditCard,
          description: "등록된 결제 수단 관리",
        },
        {
          id: "paymentHistory",
          title: "결제내역 확인",
          icon: faFileInvoice,
          description: "과거 결제 내역을 확인하세요",
        },
      ],
    },
    security: {
      title: "보안",
      icon: faShield,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      items: [
        {
          id: "password",
          title: "비밀번호",
          icon: faKey,
          description: "비밀번호를 변경하세요",
        },
        {
          id: "email",
          title: "이메일",
          icon: faEnvelope,
          description: "이메일 주소를 관리하세요",
        },
        {
          id: "phone",
          title: "휴대폰",
          icon: faPhone,
          description: "휴대폰 번호를 관리하세요",
        },
        {
          id: "devices",
          title: "액세스 디바이스",
          icon: faDesktop,
          description: "로그인된 기기를 관리하세요",
        },
      ],
    },
    support: {
      title: "고객센터",
      icon: faHeadset,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      items: [
        {
          id: "feedback",
          title: "의견보내기",
          icon: faPaperPlane,
          description: "서비스 개선을 위한 의견을 보내주세요",
        },
        {
          id: "faq",
          title: "자주묻는 질문",
          icon: faQuestionCircle,
          description: "궁금한 점을 빠르게 해결하세요",
        },
      ],
    },
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleItemClick = (categoryId, itemId) => {
    (`${categoryId} - ${itemId} 클릭됨`);
    // 여기에 각 항목별 상세 페이지 로직 추가 가능
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img src="/mypage.svg" alt="마이페이지" className="w-12 h-12" />
            <h1 className="text-4xl font-bold text-gray-900">마이 페이지</h1>
          </div>
          <p className="text-gray-600 text-lg">계정 설정 및 서비스 관리</p>
        </div>

        {/* 메인 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측 메뉴 섹션 */}
          <div className="lg:col-span-1">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">메뉴</h3>
              <div className="space-y-2">
                {Object.entries(menuData).map(([categoryId, category]) => (
                  <button
                    key={categoryId}
                    onClick={() => setActiveCategory(categoryId)}
                    className={`w-full p-4 flex items-center space-x-4 transition-all duration-300 text-left border-l-4 ${
                      activeCategory === categoryId
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-transparent hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${category.bgColor} border ${category.borderColor} flex items-center justify-center`}
                    >
                      <FontAwesomeIcon
                        icon={category.icon}
                        className={`text-lg ${category.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {category.title}
                      </h4>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`text-gray-400 transition-transform duration-300 ${
                        activeCategory === categoryId ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 콘텐츠 섹션 */}
          <div className="lg:col-span-2">
            <div className="p-6 min-h-[500px]">
              <div className="flex items-center space-x-4 mb-8">
                <div
                  className={`w-16 h-16 rounded-xl ${menuData[activeCategory].bgColor} border ${menuData[activeCategory].borderColor} flex items-center justify-center`}
                >
                  <FontAwesomeIcon
                    icon={menuData[activeCategory].icon}
                    className={`text-2xl ${menuData[activeCategory].color}`}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {menuData[activeCategory].title}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {menuData[activeCategory].items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(activeCategory, item.id)}
                    className="w-full p-5 hover:bg-gray-50 transition-all duration-300 text-left group border-l-4 border-transparent hover:border-blue-500/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${menuData[activeCategory].bgColor} border ${menuData[activeCategory].borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`text-lg ${menuData[activeCategory].color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          <button className="px-6 py-3 bg-gray-700 text-white hover:bg-amber-100 hover:text-gray-900 font-normal rounded-lg transition-colors shadow-md text-sm">
            프로필 편집
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-red-600 text-white font-normal rounded-lg transition-colors shadow-md text-sm">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
