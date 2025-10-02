import axios from 'axios';
import api from "./api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faStar,
  faMagnifyingGlass,
  faFilm,
  faUsers,
  faFolder,
  faBuilding,
  faTag,
  // faTv, // TV 사용 시 주석 해제
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Section from "./components/Section";
import MovieDetail from "./components/MovieDetail";
import SearchHeader from "./components/SearchHeader";
import MovieListPage from "./pages/MovieListPage";



export default function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upComing, setUpComing] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
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
        console.log('API 키 확인:', import.meta.env.VITE_TMDB_API_KEY);
        
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

        setNowPlaying(np.data.results.filter(movie => movie.poster_path))
        setPopular(po.data.results.filter(movie => movie.poster_path))
        setUpComing(up.data.results.filter(movie => movie.poster_path))
        setRecommend(rc.data.results.filter(movie => movie.poster_path))
        setComedyMovies(comedy.data.results.filter(movie => movie.poster_path))
        setActionMovies(action.data.results.filter(movie => movie.poster_path))
        setRomanceMovies(romance.data.results.filter(movie => movie.poster_path))

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
  //console.log(nowPlaying);

  /** 
   * 
   * Loader
   * 
  */

  const isLoading = nowPlaying.length === 0 && popular.length === 0 && upComing.length === 0 && recommend.length === 0 && actionMovies.length === 0 && romanceMovies.length === 0 && comedyMovies.length === 0;

  if (isLoading) {
    return (
      <main className="pt-16 min-h-screen bg-black text-white grid place-items-center">
        <p>로딩중...</p>
      </main>
    )
  }
  return (
    <>
      <main className="pt-16 bg-black text-white">

        <>
          <VideoHero />
          {/* 검색 타입 그리드 + 검색 인풋 */}
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4 md:mb-6">
              {searchTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedType(type.value);
                    navigate(`/search?type=${type.value}`);
                  }}
                  className={`px-2 md:px-3 py-2 rounded-lg font-medium transition-colors text-xs md:text-sm ${selectedType === type.value
                    ? 'bg-amber-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                  <span className="block text-base md:text-lg">
                    <FontAwesomeIcon icon={type.icon} />
                  </span>
                  <span className="text-xs">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="relative max-w-3xl">
              <input
                type="text"
                placeholder="영화 검색..."
                readOnly
                onFocus={() => navigate(`/search?type=${selectedType}`)}
                onClick={() => navigate(`/search?type=${selectedType}`)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer text-sm md:text-base"
              />
            </div>
          </div>
          <Section title="HOT! 요즘 뜨는 영화" items={popular} m_v={2} p_v={6} />
          <Section title="NEW! 새로 나온 영화" items={upComing} m_v={2} p_v={6} />
          <Section title="높은 평점 영화" items={recommend} m_v={2} p_v={6} orientation="horizontal" />
          <Section title="빵 터지는 무비관! 배꼽 탈출 코미디" items={comedyMovies} m_v={2} p_v={6} orientation="horizontal" />
          <Section title="근손실 방지는 여기서! 맥박 요동치는 액션" items={actionMovies} m_v={2} p_v={6} orientation="horizontal" />
          <Section title="다 죽은 연애 세포 기상! 혈당 수치 초과 로맨스" items={romanceMovies} m_v={2} p_v={6} orientation="horizontal" />
        </>


      </main>
    </>
  )
}

function VideoHero() {
  const [movieDataList, setMovieDataList] = useState([]);

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
      buttonText: "팝콘플레이 시작하기",
      image: "image1.svg"
    },
    {
      title: "사마귀",
      searchTitle: "사마귀",
      buttonText: "팝콘플레이 시작하기",
      image: "image2.svg"
    },
    {
      title: "컨저링:마지막의식",
      searchTitle: "컨저링 마지막 의식",
      buttonText: "팝콘플레이 시작하기",
      image: "image3.svg"
    },
    {
      title: "노바디2",
      searchTitle: "노바디2",
      buttonText: "팝콘플레이 시작하기",
      image: "image4.svg"
    },
    {
      title: "아바타: 물의 길 (2022)",
      searchTitle: "Avatar The Way of Water",
      buttonText: "팝콘플레이 시작하기",
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
                  className='absolute top-0 left-0 w-full h-full object-cover'
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
              <div className="relative z-10 flex-col flex justify-center h-full pl-45">
                <div className="max-w-none">
                  <h2 className="text-2xl md:text-7xl font-bold mb-6 text-[fffcf2] text-left font-pretendard">
                    {slide.title}
                  </h2>
                  {slide.subtitle ? (
                    <p className="text-xl md:text-xl mb-8 text-[#fffcf2] text-left font-pretendard">
                      {slide.subtitle}
                    </p>
                  ) : movieDataList[index] ? (
                    // 영화 슬라이드 - API 데이터 표시
                    <div className="flex items-center gap-4 mb-8 text-[#fffcf2] text-xl font-pretendard">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        {movieDataList[index].vote_average.toFixed(1)}
                      </span>
                      <span>• {movieDataList[index].runtime}분</span>
                      <span>• {movieDataList[index].genres.map(g => g.name).join(', ')}</span>
                    </div>
                  ) : (
                    // 로딩 중 표시
                    <div className="flex items-center gap-4 mb-8 text-[#fffcf2] text-xl font-pretendard">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        로딩중...
                      </span>
                      <span>• 로딩중...</span>
                      <span>• 로딩중...</span>
                    </div>
                  )}
                  <button className="bg-[#e25555] hover:bg-[#d40000] hover:text-white text-white px-5 py-3 rounded-lg text-[15px] font-bold transition-colors duration-300 font-pretendard">
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