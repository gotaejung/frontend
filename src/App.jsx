import axios from 'axios';
import api from "./api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router";
import {
  faStar,
  faMagnifyingGlass,
  faFilm,
  faUsers,
  faFolder,
  faBuilding,
  faTag,
  // faTv, // TV 사용 시 주석 해제
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Section from "./components/Section";
import SearchHeader from "./components/SearchHeader";



export default function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upComing, setUpComing] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [trailerMovies, setTrailerMovies] = useState([]);
  const [personalizedMovies, setPersonalizedMovies] = useState([]);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('multi');

  const searchTypes = [
    { value: 'multi', label: '통합 검색', icon: faMagnifyingGlass },
    { value: 'movie', label: '영화', icon: faFilm },
    /* { value: 'tv', label: 'TV 시리즈', icon: faTv }, */
    { value: 'person', label: '인물', icon: faUsers },
    { value: 'collection', label: '컬렉션', icon: faFolder },
    { value: 'company', label: '제작사', icon: faBuilding },
    { value: 'keyword', label: '키워드', icon: faTag },
  ];
  useEffect(() => {
    async function loadNowPlaying() {
      try {
        ('API 키 확인:', import.meta.env.VITE_TMDB_API_KEY);

        const np = await api.get(`now_playing?language=ko-KR`);
        const po = await api.get(`popular?language=ko-KR`);
        const up = await api.get(`upcoming?language=ko-KR`);
        // recommend 대신 top_rated 사용
        const rc = await api.get(`top_rated?language=ko-KR`)

        // 코미디 영화 (장르 ID: 35)
        const comedy = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=35&language=ko-KR`)

        // 액션 영화 (장르 ID: 28)
        const action = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=28&language=ko-KR`)

        // 로맨스 영화 (장르 ID: 10749)
        const romance = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=10749&language=ko-KR&include_adult=false&certification_country=KR&certification.lte=15`)

        // 트레일러가 있는 인기 영화들 가져오기
        const trailerMovies = [];
        for (const movie of po.data.results.slice(0, 10)) {
          try {
            const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`);
            let videos = videosRes.data.results;
            
            // 한국어 영상이 없으면 영어로 대체
            if (!videos || videos.length === 0) {
              const enVideosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`);
              videos = enVideosRes.data.results;
            }
            
            const trailer = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            if (trailer) {
              trailerMovies.push({
                ...movie,
                trailer_key: trailer.key,
                trailer_name: trailer.name
              });
            }
          } catch (error) {
            console.error(`영화 ${movie.title}의 트레일러 로드 실패:`, error);
          }
        }

        setNowPlaying(np.data.results.filter(movie => movie.poster_path))
        setPopular(po.data.results.filter(movie => movie.poster_path))
        setUpComing(up.data.results.filter(movie => movie.poster_path))
        setRecommend(rc.data.results.filter(movie => movie.poster_path))
        setComedyMovies(comedy.data.results.filter(movie => movie.poster_path))
        setActionMovies(action.data.results.filter(movie => movie.poster_path))
        setRomanceMovies(romance.data.results.filter(movie => movie.poster_path))
        setTrailerMovies(trailerMovies)

        // 개인 맞춤형 추천 영화 (여러 조건 조합)
        const personalizedRecommendations = await Promise.all([
          // 트렌딩 영화
          axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`),
          // 높은 평점 + 최신 영화
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&vote_average.gte=7.0&primary_release_date.gte=2020-01-01&sort_by=vote_average.desc`),
          // 인기 + 높은 평점 조합
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&vote_average.gte=6.5&vote_count.gte=100&sort_by=popularity.desc`)
        ]);

        // 각 카테고리에서 영화 추출하고 중복 제거
        const trendingMovies = personalizedRecommendations[0].data.results.slice(0, 6);
        const highRatedRecent = personalizedRecommendations[1].data.results.slice(0, 6);
        const popularHighRated = personalizedRecommendations[2].data.results.slice(0, 8);

        // 개인 맞춤형 추천 리스트 생성 (중복 제거)
        const allPersonalized = [...trendingMovies, ...highRatedRecent, ...popularHighRated];
        const uniquePersonalized = allPersonalized.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id) && movie.poster_path
        ).slice(0, 20);

        setPersonalizedMovies(uniquePersonalized);

      }
      catch (err) {
        console.error('로딩실패', err);
        console.error('에러 상세 정보:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        });
      }
    }
    loadNowPlaying();
  }, [])
  //(nowPlaying);

  /** 
   * 
   * Loader
   * 
  */

  const isLoading = nowPlaying.length === 0 && popular.length === 0 && upComing.length === 0 && recommend.length === 0 && actionMovies.length === 0 && romanceMovies.length === 0 && comedyMovies.length === 0 && personalizedMovies.length === 0;

  if (isLoading) {
    return (
      <main className="pt-16 min-h-screen bg-black text-white grid place-items-center">
        <p>로딩중...</p>
      </main>
    )
  }
  return (
    <main className="pt-16 bg-ㅎ text-white">
      <VideoHero />
      {/* 검색 타입 그리드 + 검색 인풋 */}
      <SearchHeader />
      
      {/* 트레일러 섹션 */}
      {trailerMovies.length > 0 && (
        <TrailerSection trailers={trailerMovies} />
      )}
      
      <Section title="HOT! 요즘 뜨는 영화" items={popular} m_v={2} p_v={6} titleTo="/movies/popular" />
      <Section title="NEW! 새로 나온 영화" items={upComing} m_v={2} p_v={6} titleTo="/movies/upcoming" />
      <Section title="당신을 위한 추천 영화" items={personalizedMovies} m_v={2} p_v={6} titleTo="/movies/personalized" />
      <Section title="높은 평점 영화" items={recommend} m_v={2} p_v={6} titleTo="/movies/top_rated" />
      <Section title="빵 터지는 무비관! 배꼽 탈출 코미디" items={comedyMovies} m_v={2} p_v={6} orientation="horizontal" titleTo="/movies/genre-35" />
      <Section title="근손실 방지는 여기서! 맥박 요동치는 액션" items={actionMovies} m_v={2} p_v={6} orientation="horizontal" titleTo="/movies/genre-28" />
      <Section title="다 죽은 연애 세포 기상! 혈당 수치 초과 로맨스" items={romanceMovies} m_v={2} p_v={6} orientation="horizontal" titleTo="/movies/genre-10749" />

      {/* 푸터 */}
      <footer className="bg-black text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          {/* 소셜 미디어 섹션 */}
          <div className="flex justify-start space-x-8 mb-8 pb-6">
            <a href="#" className="text-gray-100 hover:text-blue-500 transition-colors duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
            </a>
            <a href="#" className="text-gray-100 hover:text-pink-500 transition-colors duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
            </a>
            <a href="#" className="text-gray-100 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faXTwitter} className="text-2xl" />
            </a>
            <a href="#" className="text-gray-100 hover:text-red-500 transition-colors duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
            </a>
          </div>

          {/* 푸터 메인 콘텐츠 - 3행 4열 그리드 */}
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-center md:text-left">
              {/* 1행 */}
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">화면해설</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">고객센터</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">기프트카드</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">미디어센터</a>
              
              {/* 2행 */}
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">투자정보(IR)</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">입사정보</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">이용약관</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">개인정보</a>
              
              {/* 3행 */}
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">법적고지</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">쿠키설정</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">회사정보</a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors text-sm">문의하기</a>
            </div>
          </div>

          {/* 푸터 하단 - 회사 정보 */}
          <div className="pt-6">
            <div className="text-gray-100 text-xs leading-relaxed space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                <span>주식회사 팝콘플레이</span>
                <span className="hidden md:inline">|</span>
                <span>통신판매업신고번호: 제2018-서울종로-0426호</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                <span>전화번호: 00-00-00-00 (수신자 부담)</span>
                <span className="hidden md:inline">|</span>
                <span>대표: 김팝콘</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                <span>이메일 주소: 
                  <a href="mailto:korea@popcornplay.com" className="hover:text-white transition-colors">
                    korea@popcornplay.com
                  </a>
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                <span>주소: 서울 종로구 종로 69 (종로2가) 3층 MBC아카데미컴퓨터교육센터</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
                <span>사업자등록번호: 000-00-00119</span>
                <span className="hidden md:inline">|</span>
                <a href="#" className="hover:text-white transition-colors underline">
                  공정거래위원회 웹사이트
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function VideoHero() {
  const [movieDataList, setMovieDataList] = useState([]);
  const navigate = useNavigate();

  const slides = [
    {
      title: "POPCORN PLAY",
      subtitle: "최신 영화와 인기 작품을 만나보세요.",
      buttonText: "지금 시작하기",
      video: "video_popcornplay.mp4"
    },
    {
      title: "케이팝 데몬 헌터스 (2025)",
      searchTitle: "케이팝 데몬 헌터스",
      buttonText: "재생하기",
      image: "image1.svg"
    },
    {
      title: "사마귀",
      searchTitle: "사마귀",
      buttonText: "재생하기",
      image: "image2.svg"
    },
    {
      title: "컨저링:마지막의식",
      searchTitle: "컨저링 마지막 의식",
      buttonText: "재생하기",
      image: "image3.svg"
    },
    {
      title: "노바디2",
      searchTitle: "노바디2",
      buttonText: "재생하기",
      image: "image4.svg"
    },
    {
      title: "아바타: 물의 길 (2022)",
      searchTitle: "Avatar The Way of Water",
      buttonText: "재생하기",
      image: "image5.svg"
    },
  ];

  useEffect(() => {
    const fetchAllMovieData = async () => {
      try {
        const moviePromises = slides.map(async (slide) => {
          try {
            // 1단계: 영화 제목으로 검색
            const searchResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${slide.searchTitle}&language=ko-KR`
            );

            if (searchResponse.data.results.length > 0) {
              const movieId = searchResponse.data.results[0].id;

              // 2단계: 영화 상세 정보 가져오기
              const detailResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`
              );

              return detailResponse.data;
            }
            return null;
          } catch (error) {
            console.error(`영화 "${slide.searchTitle}" 정보 로드 실패:`, error);
            return null;
          }
        });

        const results = await Promise.all(moviePromises);
        setMovieDataList(results);
      } catch (error) {
        console.error('영화 정보 로드 실패:', error);
      }
    };

    fetchAllMovieData();
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {slide.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className='absolute top-0 left-0 w-full h-full object-cover'
                >
                  <source src={slide.video} />
                </video>
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className='absolute top-0 left-0 w-full h-full object-cover object-center md:object-center'
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
              <div className="relative z-10 flex-col flex justify-center h-full px-4 pl-6 md:pl-16 lg:pl-45">
                <div className="max-w-none">
                  <h2 className="text-2xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-6 text-[fffcf2] text-left font-pretendard">
                    {slide.title}
                  </h2>
                  {slide.subtitle ? (
                    <p className="text-xl md:text-xl mb-4 md:mb-8 text-[#fffcf2] text-left font-pretendard">
                      {slide.subtitle}
                    </p>
                  ) : movieDataList[index] ? (
                    // 영화 슬라이드 - API 데이터 표시
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-8 text-[#fffcf2] text-sm md:text-lg lg:text-xl font-pretendard">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        {movieDataList[index].vote_average.toFixed(1)}
                      </span>
                      <span>• {movieDataList[index].runtime}분</span>
                      <span>• {movieDataList[index].genres.map(g => g.name).join(', ')}</span>
                    </div>
                  ) : (
                    // 로딩 중 표시
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-8 text-[#fffcf2] text-sm md:text-lg lg:text-xl font-pretendard">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        로딩중...
                      </span>
                      <span>• 로딩중...</span>
                      <span>• 로딩중...</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (index > 0 && movieDataList[index] && movieDataList[index].id) {
                        navigate(`/movie/${movieDataList[index].id}`);
                      }
                    }}
                    className="bg-[#e25555] hover:bg-[#d40000] hover:text-white text-white px-4 py-2 md:px-5 md:py-3 rounded-lg text-sm md:text-[15px] font-bold transition-colors duration-300 font-pretendard"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

function TrailerSection({ trailers }) {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const openTrailer = (trailer) => {
    setSelectedTrailer(trailer);
  };

  const closeTrailer = () => {
    setSelectedTrailer(null);
  };

  return (
    <>
      <section className="bg-black py-6 md:py-10 px-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/trailers" className="text-2xl md:text-4xl font-bold text-white hover:underline">
              Trailer (예고편)
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={8}
            navigation
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {trailers.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="group cursor-pointer" onClick={() => openTrailer(movie)}>
                  <div className="relative rounded-lg overflow-hidden bg-neutral-800">
                    {/* YouTube 썸네일 */}
                    <div className="relative aspect-video">
                      <img
                        src={`https://img.youtube.com/vi/${movie.trailer_key}/maxresdefault.jpg`}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${movie.trailer_key}/hqdefault.jpg`;
                        }}
                      />
                      {/* 재생 버튼 오버레이 */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 영화 정보 */}
                    <div className="p-3">
                      <Link 
                        to={`/movie/${movie.id}`}
                        className="block font-bold text-lg mb-2 truncate text-white hover:text-gray-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {movie.title}
                      </Link>
                      <div className="flex justify-between items-center text-sm text-gray-200">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                          <span className="text-[#fff7df]">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <div className="text-[#fff7df]">
                          {movie.release_date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 트레일러 모달 */}
      {selectedTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closeTrailer}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeTrailer}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕
            </button>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedTrailer.trailer_key}?autoplay=1`}
                title={selectedTrailer.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-bold">{selectedTrailer.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{selectedTrailer.trailer_name}</p>
            </div>
          </div>
        </div>
      )}


    </>
  );
}