import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function TrailerListPage() {
  const [trailerMovies, setTrailerMovies] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrailerMovies = async () => {
      try {
        setLoading(true);
        
        // 인기 영화들 가져오기
        const popularRes = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&page=1`
        );
        
        // 최신 영화들도 추가로 가져오기
        const upcomingRes = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&page=1`
        );
        
        // 두 리스트 합치기
        const allMovies = [...popularRes.data.results, ...upcomingRes.data.results];
        
        // 트레일러가 있는 영화들 필터링
        const trailerMovies = [];
        for (const movie of allMovies.slice(0, 20)) {
          try {
            const videosRes = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`
            );
            let videos = videosRes.data.results;
            
            // 한국어 영상이 없으면 영어로 대체
            if (!videos || videos.length === 0) {
              const enVideosRes = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
              );
              videos = enVideosRes.data.results;
            }
            
            const trailer = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            if (trailer && movie.poster_path) {
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
        
        setTrailerMovies(trailerMovies);
      } catch (err) {
        setError('트레일러를 불러오는데 실패했습니다.');
        console.error('트레일러 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailerMovies();
  }, []);

  const openTrailer = (trailer) => {
    setSelectedTrailer(trailer);
  };

  const closeTrailer = () => {
    setSelectedTrailer(null);
  };

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-xl">트레일러를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-16 min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-16 min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">🎬 Trailer (예고편)</h1>
            <p className="text-gray-300 text-lg">최신 영화와 인기 작품의 예고편을 만나보세요</p>
          </div>

          {/* 트레일러 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trailerMovies.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => openTrailer(movie)}
              >
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
                  <div className="p-4">
                    <Link 
                      to={`/movie/${movie.id}`}
                      className="block font-bold text-lg mb-2 line-clamp-2 text-white leading-tight hover:text-gray-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {movie.title}
                    </Link>
                    <div className="flex justify-between items-center text-sm text-gray-200 mb-2">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        <span className="text-[#fff7df]">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                      <div className="text-[#fff7df]">
                        {movie.release_date?.split('-')[0]}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {movie.trailer_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {trailerMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">트레일러를 찾을 수 없습니다.</p>
            </div>
          )}
        </div>
      </main>

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