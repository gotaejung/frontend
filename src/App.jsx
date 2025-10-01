import axios from 'axios';
import api from "./api/axios";
import { Route, Routes, Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
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
import Chatbot from "./components/Chatbot";
import SearchPage from "./components/SearchPage";
import MyPage from "./components/MyPage";
import KakaoLogin from "./components/KakaoLogin";
import KakaoCallback from "./components/KakaoCallback";
import NaverLogin from "./components/NaverLogin";
import NaverCallback from "./components/NaverCallback";
import SocialLogin from "./components/SocialLogin";



export default function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upComing, setUpComing] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
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
        console.error('로딩실패', err)
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
      <Header />
      <main className="bg-black text-white">
        <Routes>
          <Route path="/" element={
            <>
              <VideoHero />
              {/* 검색 타입 그리드 + 검색 인풋 */}
              <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                  {searchTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedType(type.value);
                        navigate(`/search?type=${type.value}`);
                      }}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${selectedType === type.value
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                      <span className="block text-lg">
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
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>
              <Section title="내가 좋아할 만한 영화" items={nowPlaying} m_v={2} p_v={6} />
              <Section title="HOT! 요즘 뜨는 영화" items={popular} m_v={2} p_v={6} orientation="horizontal" />
              <Section title="NEW! 새로 나온 영화" items={upComing} m_v={2} p_v={6} />
              <Section title="높은 평점 영화" items={recommend} m_v={2} p_v={6} orientation="horizontal" />
              <Section title="빵 터지는 무비관! 배꼽 탈출 코미디" items={comedyMovies} m_v={2} p_v={6} />
              <Section title="근손실 방지는 여기서! 맥박 요동치는 액션" items={actionMovies} m_v={2} p_v={6} orientation="horizontal" />
              <Section title="다 죽은 연애 세포 기상! 혈당 수치 초과 로맨스" items={romanceMovies} m_v={2} p_v={6} />
            </>
          } />
          <Route path='/movie/:id' element={<MovieDetail />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/My Page' element={<MyPage />} />
          <Route path='/auth/kakao/callback' element={<KakaoCallback />} />
          <Route path='/auth/naver/callback' element={<NaverCallback />} />
        </Routes>
      </main>
      <Chatbot />
    </>
  )
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full py-4 px-2 bg-black/90 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src="./logo.svg" alt="Logo" className="w-50" />
          </Link>

          {/* <nav className="hidden md:flex space-x-8 ml-8">
            <Link to="/About" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold">
              About
            </Link>
            <Link to="/Movie" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold">
              Movie
            </Link>
            <Link to="/People" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold">
              People
            </Link>
          </nav> */}
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/search" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold">
            검색
          </Link>
          <Link to="/My Page" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold">
            My page
          </Link>
          <SocialLogin />
        </div>
      </div>
    </header>
  )
}
function VideoHero() {
  const slides = [
    {
      title: "POPCORN PLAY",
      subtitle: "최신 영화와 인기 작품을 만나보세요.",
      buttonText: "지금 시작하기",
      video: "video_popcornplay.mp4"
    },
    {
      title: "액션 무비 월드",
      subtitle: "스릴 넘치는 액션 영화의 세계로!",
      buttonText: "액션 영화 보기",
      image: "poster3.svg"
    },
    {
      title: "로맨틱 시네마",
      subtitle: "감동적인 러브 스토리와 함께하세요.",
      buttonText: "로맨스 영화 보기",
      image: "poster2.svg"
    }
  ];

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
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 flex-col flex items-center justify-center h-full">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-amber-100">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl text-amber-100 text-center">
                  {slide.subtitle}
                </p>
                <button className="bg-amber-100 hover:bg-amber-500 hover:text-white text-black px-8 py-4 rounded-lg text-lg font-bold transition-colors duration-300">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}