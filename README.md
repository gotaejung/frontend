# POPCORN PLAY 🎬

> 영화 스트리밍 서비스 웹 애플리케이션

## 📋 프로젝트 개요

POPCORN PLAY는 **The Movie Database (TMDB) API**를 활용하여 최신 영화 정보를 제공하는 반응형 웹 애플리케이션입니다. 사용자들이 현재 상영작, 인기작, 상영 예정작을 쉽게 탐색할 수 있습니다.

## 🔗 링크

### 🌐 배포 URL
- **프론트엔드**: [https://frontend-nu-orcin-85.vercel.app]
- **백엔드 API**: [https://backend-1w2e.onrender.com/]

### 📂 리포지토리 URL
- **프론트엔드**: [https://github.com/gotaejung/frontend.git]
- **백엔드**: [https://github.com/gotaejung/backend.git]


## ✨ 주요 기능

### 🎭 영화 정보
- **인기 상영작**: 높은 인기를 얻고 있는 영화들
- **최신 상영작**: 곧 개봉할 예정인 영화들
- **높은 평점 영화**: 높은 평점을 받은 영화들
- **영화 상세 정보**: 포스터, 줄거리, 평점, 개봉일, 상영시간 등

### 🤖 챗봇 기능
- **실시간 챗봇**: Flask 백엔드와 연동된 네이버 AI 챗봇
- **플로팅 UI**: 우하단 고정 챗봇 인터페이스

### 📱 사용자 경험
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **트렌디한 스타일 UI**: 어두운 테마와 레드 포인트 컬러
- **부드러운 애니메이션**: 호버 효과 및 트랜지션
- **비디오 히어로**: 메인 페이지 배경 비디오

## 🛠 기술 스택

### Frontend
- **React 19.1.1**: 최신 React 버전
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **React Router**: 클라이언트 사이드 라우팅
- **TailwindCSS 4.1.13**: 유틸리티 퍼스트 CSS 프레임워크
- **FontAwesome**: 아이콘 라이브러리
- **Axios**: HTTP 클라이언트

### Backend
- **Flask**: Python 웹 프레임워크 (챗봇 API)
- **TMDB API**: 영화 데이터 제공

### Deployment
- **Frontend**: Vite 빌드 + 정적 호스팅
- **Backend**: Render.com (https://backend-1w2e.onrender.com)

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js (18+)
- npm 또는 yarn
- TMDB API 키

### 1. 저장소 클론
```bash
git clone <repository-url>
cd react-movie
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 루트 디렉토리에 생성하고 다음 내용을 추가하세요:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

**TMDB API 키 발급 방법:**
1. [TMDB 웹사이트](https://www.themoviedb.org/)에서 계정 생성
2. API 키 신청 및 발급
3. 위 환경 변수에 키 입력

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 📁 프로젝트 구조

```
📦src
 ┣ 📂api
 ┃ ┣ 📜axios.js                # API 설정 (TMDB, 챗봇)
 ┃ ┗ 📜config.js
 ┣ 📂components
 ┃ ┣ 📜Card.jsx                # 영화 카드 컴포넌트
 ┃ ┣ 📜Chatbot.jsx             # 챗봇 UI 컴포넌트
 ┃ ┣ 📜KakaoCallback.jsx
 ┃ ┣ 📜KakaoLogin.jsx
 ┃ ┣ 📜LoginPage.jsx
 ┃ ┣ 📜MovieDetail.jsx         # 영화 상세 페이지
 ┃ ┣ 📜MyPage.jsx
 ┃ ┣ 📜NaverCallback.jsx
 ┃ ┣ 📜NaverLogin.jsx
 ┃ ┣ 📜SearchHeader.jsx
 ┃ ┣ 📜SearchPage.jsx
 ┃ ┣ 📜Section.jsx             # 영화 섹션 컴포넌트
 ┃ ┗ 📜SocialLogin.jsx
 ┣ 📂pages
 ┃ ┣ 📜MovieListPage.jsx
 ┃ ┗ 📜TrailerListPage.jsx
 ┣ 📜App.jsx                   # 메인 앱 컴포넌트
 ┣ 📜index.css                 # TailwindCSS 스타일
 ┣ 📜main.jsx                  # React 엔트리포인트
 ┗ 📜RootLayout.jsx
```

## 🎯 주요 컴포넌트 설명

### App.jsx
- 메인 애플리케이션 로직
- TMDB API 데이터 fetching
- 라우팅 설정 (홈, 영화 상세)
- 헤더 및 비디오 히어로 섹션

### MovieDetail.jsx
- 개별 영화의 상세 정보 표시
- URL 파라미터를 통한 영화 ID 추출
- 영화 포스터, 정보, 줄거리 등 렌더링

### Chatbot.jsx
- Flask 백엔드와 연동된 챗봇
- 실시간 메시지 송수신
- 로딩 상태 및 에러 처리

## 📊 API 연동

### TMDB API
```javascript
// 현재 상영작
GET /movie/now_playing?language=ko-KR

// 인기 영화
GET /movie/popular?language=ko-KR

// 상영 예정
GET /movie/upcoming?language=ko-KR

// 영화 상세
GET /movie/{id}?language=ko-KR
```

### 챗봇 API
```javascript
// 챗봇 메시지 전송
POST /chat
{
  "message": "사용자 메시지"
}
```

## 🎨 디자인 특징

- **다크 테마**: 영화관 분위기의 검은색 배경
- **아이보리 액센트**: 아이보리색 포인트 컬러로 고급스러운 느낌
- **카드 기반 레이아웃**: 영화 정보를 카드 형태로 구성
- **호버 이펙트**: 마우스 오버 시 스케일 애니메이션
- **반응형 그리드**: 화면 크기에 따른 적응형 레이아웃

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 빌드 미리보기
npm run preview
```

## 🌟 향후 개선 계획

- [ ] 사용자 인증 및 개인화 기능
- [ ] 영화 즐겨찾기 및 시청 목록
- [ ] 고급 검색 및 필터링
- [ ] 영화 리뷰 및 평점 시스템
- [ ] 소셜 공유 기능
- [ ] PWA (Progressive Web App) 지원


### Git 브랜치 전략
이 프로젝트는 **단일 브랜치 전략(Trunk-based Development)**을 사용하였습니다. 모든 개발은 main 브랜치에서 직접 이루어졌으며, 다음과 같은 커밋 메시지 규칙을 따릅니다:


| 타입 | 설명 |
|------|------|
| **Feat** | 새로운 기능 추가 |
| **Fix** | 버그 수정 |
| **Docs** | 문서 수정(README, 주석 등) |
| **Style** | 코드 포맷, 세미콜론 누락 등 비기능적 수정 |
| **Refactor** | 코드 리팩토링(기능 변경 없음) |
| **Test** | 테스트 코드 추가 및 수정 |
| **Chore** | 기타 작업(빌드 설정, 패키지 설치 등) |
| **Remove** | 코드/파일 삭제 |
| **Rename** | 파일/변수명 변경 |


### 커밋 메시지 예시
```bash
# 새 기능 추가
git commit -m "Feat: 영화 검색 기능 추가"

# 버그 수정
git commit -m "Fix: 챗봇 API 연결 오류 수정"

# 문서 업데이트
git commit -m "Docs: README.md 설치 가이드 업데이트"

# 스타일 수정
git commit -m "Style: 코드 포맷팅 및 린트 오류 수정"
```

## 📝 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

## 📞 문의

프로젝트와 관련된 문의사항이 있으시면 언제든지 연락해주세요.


## 개발기간
9월 17일 - 10월 10일 (3주 가량)


## 구성원
고태정 - gotaejung <br>
민겨레 - minsunduck <br>
김지연 - kimjiyeon970608 <br>
옥다희 - dahee1230


## 역할분담
```
고태정 : 서비스 조사 및 기획, 영상 스토리보드, 컴포넌트 제작-헤더, 푸터, 챗봇 로그인 기능, 파이썬 API 서버 구축, API 연결 및 배포
민겨레 : 서비스 조사 및 기획, 화면 디자인 시안-메인, 상세페이지, 컴포넌트 제작-상세페이지, 장르별 페이지, 파이썬 API 서버 구축, API 연결 및 배포
김지연 : 서비스 조사 및기획, 로고 디자인, 영상 제작 및 편집, 챗봇 대화 시나리오 작성, 파이썬 API 서버 구축, 테스트 및 디버깅, 스타일 가이드 작성
옥다희 : 서비스 조사 및 기획, 컴포넌트 제작-홈화면, 영상 제작 및 편집, 파이썬 API 서버 구축, 테스트 및 디버깅
```
---

**Popcorn Play** - 영화를 사랑하는 모든 이들을 위한 플랫폼 🎬✨