import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import api from '../api/axios';

export default function MovieListPage() {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageMeta = useMemo(() => {
    const map = {
      popular: 'HOT! 요즘 뜨는 영화',
      upcoming: 'NEW! 새로 나온 영화',
      top_rated: '높은 평점 영화',
      personalized: '당신을 위한 추천 영화',
      'genre-35': '빵 터지는 무비관! 배꼽 탈출 코미디',
      'genre-28': '근손실 방지는 여기서! 맥박 요동치는 액션',
      'genre-10749': '다 죽은 연애 세포 기상! 혈당 수치 초과 로맨스',
    };
    return map[type] ?? '영화 목록';
  }, [type]);

  useEffect(() => {
    let mounted = true;
    async function fetchList() {
      setLoading(true);
      try {
        const take30 = (arr) => arr.filter(m => m.poster_path).slice(0, 30);

        if (['popular', 'upcoming', 'top_rated'].includes(type)) {
          const [p1, p2] = await Promise.all([
            api.get(`${type}?language=ko-KR&page=1`),
            api.get(`${type}?language=ko-KR&page=2`),
          ]);
          if (!mounted) return;
          setItems(take30([...p1.data.results, ...p2.data.results]));
        } else if (type === 'personalized') {
          // 개인 맞춤형 추천 로직
          const [trending, highRated, popularRated] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`),
            axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&vote_average.gte=7.0&primary_release_date.gte=2020-01-01&sort_by=vote_average.desc`),
            axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&vote_average.gte=6.5&vote_count.gte=100&sort_by=popularity.desc`)
          ]);
          
          const allPersonalized = [...trending.data.results, ...highRated.data.results, ...popularRated.data.results];
          const uniquePersonalized = allPersonalized.filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id) && movie.poster_path
          );
          if (!mounted) return;
          setItems(take30(uniquePersonalized));
        } else if (type?.startsWith('genre-')) {
          const genreId = type.split('-')[1];
          const base = `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&with_genres=${genreId}`;
          const extra =
            genreId === '10749'
              ? '&include_adult=false&certification_country=KR&certification.lte=15'
              : '';
          const [p1, p2] = await Promise.all([
            axios.get(`${base}&page=1${extra}`),
            axios.get(`${base}&page=2${extra}`),
          ]);
          if (!mounted) return;
          setItems(take30([...p1.data.results, ...p2.data.results]));
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('리스트 로딩 실패:', e);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    fetchList();
    return () => { mounted = false; };
  }, [type]);

  return (
    <main className="pt-14 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{pageMeta}</h1>
          <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm">홈으로</Link>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">로딩중...</div>
        ) : items.length === 0 ? (
          <div className="grid place-items-center py-16">결과가 없습니다.</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((m) => (
              <li key={m.id} className="group">
                <Link to={`/movie/${m.id}`} className="block">
                  <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                      alt={m.title || m.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{m.title || m.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}