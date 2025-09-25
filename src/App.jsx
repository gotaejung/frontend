import axios from 'axios';
import api from "./api/axios";
import { Route, Routes, Link } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

import Section from "./components/Section";
import MovieDetail from "./components/MovieDetail";
import Chatbot from "./components/Chatbot";




export default function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upComing, setUpComing] = useState([]);


  useEffect(() => {
    async function loadNowPlaying() {
      try {
        const np = await api.get(`now_playing?language=ko-KR`);
        const po = await api.get(`popular?language=ko-KR`);
        const up = await api.get(`upcoming?language=ko-KR`);
        setNowPlaying(np.data.results.filter(movie => movie.poster_path))
        setPopular(po.data.results.filter(movie => movie.poster_path))
        setUpComing(up.data.results.filter(movie => movie.poster_path))
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

  const isLoading = nowPlaying.length === 0 && popular.length === 0 && upComing.length === 0;

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
              <Section title="현재 상영작" items={nowPlaying} />
              <Section title="인기 상영작" items={popular} />
              <Section title="상영 예정작" items={upComing} />
            </>
          } />
          <Route path='/movie/:id' element={<MovieDetail />} />
        </Routes>
      </main>
      <Chatbot />
    </>
  )
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full py-4 px-2 bg-black/90 z-50">
      <div className="container mx-auto">
        <Link to="/">
          <h1 className="text-3xl text-yellow-300 font-bold">
            <FontAwesomeIcon icon={faHouse} />GOFLIX</h1>
        </Link>
      </div>
    </header>
  )
}
function VideoHero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <video autoPlay muted loop playsInline className='absolute top-0 left-0 w-full h-full object-cover'>
        <source src='video.mp4' />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex-col flex items-center justify-center h-full">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-300">
          GOFLEX
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          최신 영화와 인기 작품을 만나보세요.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg text-lg font-bold transition-colors duration-300">지금 시작하기</button>
      </div>
    </section>
  )
}