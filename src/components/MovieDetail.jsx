import api from "../api/axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false)

  // 추가: 유사 영화 토글/데이터 상태
  const [similar, setSimilar] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState(null);
  
  useEffect(() => {
    async function getMovieDetails() {
      try {
        const movieRes = await api.get(`${id}?language=ko-KR`);
        const creditsRes = await api.get(`${id}/credits?language=ko-KR`);
        setMovie(movieRes.data)
        setCredits(creditsRes.data)
      } catch (error) {
        console.error('영화 정보를 가져오는데 실패했습니다:', error);
      }
    }
    // id 변경 시 하단 뷰 초기화
    setShowSimilar(false);
    setSimilar([]);
    setSimilarError(null);

    getMovieDetails()
  }, [id])/* 의존성배열의 값이 바꿀때  실행 */

  // ▼ 추가: 하단 영역 토글/데이터 로드 (페이지 이동 없음)
  const openSimilar = async () => {
    setShowSimilar(true);
    if (similar.length || loadingSimilar) return; // 이미 로드했으면 재요청 안 함
    setLoadingSimilar(true);
    try {
      const res = await api.get(`${id}/similar?language=ko-KR&page=1`);
      setSimilar(res.data?.results || []);
    } catch (e) {
      setSimilarError('유사한 영화를 불러오지 못했습니다.');
    } finally {
      setLoadingSimilar(false);
    }
  };
  const openReviews = () => setShowSimilar(false);

  if (!movie || !credits) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  // 감독 찾기 (안전 가드)
  const director = Array.isArray(credits?.crew)
    ? credits.crew.find(person => person.job === 'Director')
    : null;

  // 안전 포맷터
  const safeAvg = (v) => (typeof v === 'number' ? v.toFixed(1) : '0.0');
  const safeCount = (n) => (typeof n === 'number' ? n.toLocaleString() : '0');
  const firstGenre = (g) => (Array.isArray(g) && g[0]?.name ? g[0].name : '영화');
  const year = (d) => (d ? d.split('-')[0] : '-');

  // ▼ 추가: 유사영화 카드용 유틸
  const genreMap = {
    28:'액션',12:'모험',16:'애니메이션',35:'코미디',80:'범죄',99:'다큐',
    18:'드라마',10751:'가족',14:'판타지',36:'역사',27:'공포',10402:'음악',
    9648:'미스터리',10749:'로맨스',878:'SF',10770:'TV 영화',53:'스릴러',
    10752:'전쟁',37:'서부'
  };
  const getGenreName = (ids) => (Array.isArray(ids) && ids.length ? (genreMap[ids[0]] || '영화') : '영화');
  const renderStars = (avg) => {
    const filled = Math.round(((typeof avg === 'number' ? avg : 0) / 10) * 5); // 0~10 → 0~5
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < filled ? 'text-yellow-400' : 'text-gray-500'}>★</span>
    ));
  };

  //영화상세정보
  return (
    <>
      {/* Desktop Layout (768px+) */}
      <div className="hidden md:block min-h-screen bg-gray-800 text-white" style={{ fontFamily: 'Pretendard, sans-serif' }}>
        <div className="container mx-auto px-4 py-20">
          <div className="flex gap-8 h-full">
            {/* Left Side - Movie Poster */}
            <div className="w-1/3 h-full">
              <div className="bg-gray-100 p-8 rounded-lg h-full flex items-center">
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : '/no-poster.png'}
                   alt={movie.title}
                   className="w-full h-full object-cover rounded-lg shadow-lg max-h-[600px]"
                />
              </div>
            </div>

            {/* Right Side - Movie Info */}
            <div className="w-2/3">
              <div className="bg-gray-800 text-white">
                {/* Movie Title and Rating */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-3 text-white flex items-center gap-2">
                    {movie.title}
                    <span className="text-gray-400 text-sm">▼</span>
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg mr-1">⭐</span>
                      <span className="text-white font-bold">{safeAvg(movie.vote_average)}</span>
                      <span className="text-blue-400 ml-1">({safeCount(movie.vote_count)})</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{year(movie.release_date)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{firstGenre(movie.genres)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{typeof movie.runtime === 'number' ? movie.runtime : '-'}분</span>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex">
                    <span className="text-gray-400 font-medium w-16">감독</span>
                    <span className="text-white">{director ? director.name : '정보 없음'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-400 font-medium w-16">출연진</span>
                    <span className="text-white">
                      {(Array.isArray(credits?.cast) ? credits.cast.slice(0, 3) : [])
                        .map(actor => actor.name).join(', ')}...
                    </span>
                  </div>
                </div>

                {/* Watch Button */}
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg mb-6 transition-colors">
                  재생하기
                </button>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">📥</span>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">♡</span>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">↗</span>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">📱</span>
                    </div>
                  </button>
                </div>

                {/* Movie Overview */}
                <div className="mb-0">
                  <p className="text-gray-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* 리뷰 섹션은 아래 전체 너비로 이동했습니다 */}
              </div>
            </div>
          </div>

          {/* Desktop: Full-width Reviews (전체 너비) */}
          <div className="mt-12">
            <div className="border-t border-gray-600 pt-6">
              {/* 헤더: 리뷰 | 유사한 영화 추천 (동일 강조, 토글) */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openReviews}
                    className={`font-bold text-lg ${!showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    리뷰
                  </button>
                  <span className="text-blue-400">(135)</span>
                </div>
                <button
                  type="button"
                  onClick={openSimilar}
                  className={`font-bold text-lg ${showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  유사한 영화 추천
                </button>
              </div>

              {/* 내용: 유사영화 or 기존 리뷰 */}
              {showSimilar ? (
                <div className="mb-6">
                  {loadingSimilar && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                  {similarError && <div className="text-red-400 text-center py-6">{similarError}</div>}
                  {!loadingSimilar && !similarError && (
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                      {similar.slice(0, 12).map(s => (
                        <div
                          key={s.id}
                          className="group rounded-md overflow-hidden bg-gray-900/60 border border-gray-700 hover:border-gray-600 transition-colors"
                          title={s.title}
                        >
                          <div className="aspect-[2/3] bg-gray-700 overflow-hidden">
                            <img
                              src={s.poster_path ? `https://image.tmdb.org/t/p/w342${s.poster_path}` : '/no-poster.png'}
                              alt={s.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>
                          <div className="px-2.5 pt-1.5 pb-2.5">
                            <p className="text-xs text-gray-100 truncate group-hover:text-white">{s.title}</p>
                            <div className="mt-0.5 flex items-center justify-between">
                              <div className="flex items-center gap-0.5 text-[10px] leading-none">
                                {renderStars(s.vote_average)}
                              </div>
                              <span className="text-blue-400 text-xs font-semibold">
                                {safeAvg(typeof s.vote_average === 'number' ? s.vote_average : 0)}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[10px] text-gray-300">
                              {getGenreName(s.genre_ids)} • {year(s.release_date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-gray-300 text-sm text-center">
                      리뷰를 작성하려면 영화를 충분히 감상해주세요
                    </p>
                    <p className="text-gray-400 text-xs text-center mt-1">
                      작성하신 소중한 리뷰는 다른 사용자에게 큰 도움이 됩니다.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex text-yellow-400 text-xl">
                      {[...Array(5)].map((_, i) => (<span key={i}>⭐</span>))}
                    </div>
                    <span className="text-gray-300">135개의 평점</span>
                    <span className="text-white text-xl font-bold">4.5</span>
                  </div>

                  <div className="flex justify-end mb-4">
                    <span className="text-gray-400 text-sm">베스트순 ▼</span>
                  </div>

                  <div className="border-b border-gray-600 pb-4">
                    {/* 기존 샘플 리뷰 블록 */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                          <span className="text-white font-medium">민선덕</span>
                          <span className="text-gray-400 text-sm">2024년 9월 23일</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-3">
                          이 영화는 어른들을 위한 동화같아요 영화관에서 아이들과 함께봤다가 
                          아이들이 다 울어서 난감했어요 그런데 영화가 자꾸 생각나고 다시 
                          고민되고 그렇 좋아하면 재혀요
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-white">
                            <span>👍</span>
                            <span>135</span>
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <span>👎</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (767px-) */}
      <div className="block md:hidden min-h-screen" style={{ fontFamily: 'Pretendard, sans-serif' }}>
        {/* Mobile Header with Poster */}
        <div className="relative bg-gray-100 pt-16">
          <div className="w-full">
            <img
              src={movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : '/no-poster.png'}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="bg-gray-800 text-white">
          {/* Title and Meta Info */}
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold mb-3 text-white leading-tight">{movie.title}</h1>
            
            {/* Rating and Meta */}
            <div className="flex items-center gap-1 text-sm mb-4">
              <span className="text-yellow-400 text-base">⭐</span>
              <span className="text-white font-bold">{safeAvg(movie.vote_average)}</span>
              <span className="text-blue-400">({safeCount(movie.vote_count)})</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-gray-400">{year(movie.release_date)}</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-gray-400">{firstGenre(movie.genres)}</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-gray-400">{typeof movie.runtime === 'number' ? movie.runtime : '-'}분</span>
            </div>
          </div>

          {/* Watch Button */}
          <div className="px-4 mb-6">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg transition-colors">
              재생하기
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mb-8">
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-500">
                <span className="text-sm">📥</span>
              </div>
            </button>
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-500">
                <span className="text-sm">♡</span>
              </div>
            </button>
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-500">
                <span className="text-sm">↗</span>
              </div>
            </button>
            <button className="flex flex-col items-center text-gray-300 hover:text-white">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-500">
                <span className="text-sm">📱</span>
              </div>
            </button>
          </div>

          {/* Movie Details */}
          <div className="px-4 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-sm">감독</span>
              <span className="text-white text-sm text-right flex-1 ml-4">
                {director?.name ?? '정보 없음'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-medium text-sm">출연진</span>
              <span className="text-white text-sm text-right flex-1 ml-4 leading-relaxed">
                {(Array.isArray(credits?.cast) ? credits.cast.slice(0, 3) : [])
                  .map(actor => actor.name).join(', ')}...
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="px-4 mb-8">
            <p className="text-gray-300 leading-relaxed text-sm">
              {movie.overview}
            </p>
          </div>

          {/* Reviews Section (모바일도 동일 토글) */}
          <div className="px-4 border-t border-gray-600 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openReviews}
                  className={`font-bold text-lg ${!showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  리뷰
                </button>
                <span className="text-blue-400 text-sm">(135)</span>
              </div>
              <button
                type="button"
                onClick={openSimilar}
                className={`font-bold text-lg ${showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                유사한 영화 추천
              </button>
            </div>

            {showSimilar ? (
              <div className="mb-6">
                {loadingSimilar && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                {similarError && <div className="text-red-400 text-center py-6">{similarError}</div>}
                {!loadingSimilar && !similarError && (
                  <div className="grid grid-cols-2 gap-3">
                    {similar.slice(0, 9).map(s => (
                      <div
                        key={s.id}
                        className="group rounded-md overflow-hidden bg-gray-900/60 border border-gray-700 hover:border-gray-600 transition-colors"
                        title={s.title}
                      >
                        <div className="aspect-[2/3] bg-gray-700 overflow-hidden">
                          <img
                            src={s.poster_path ? `https://image.tmdb.org/t/p/w342${s.poster_path}` : '/no-poster.png'}
                            alt={s.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <div className="px-2.5 pt-1.5 pb-2.5">
                          <p className="text-xs text-gray-100 truncate group-hover:text-white">{s.title}</p>
                          <div className="mt-0.5 flex items-center justify-between">
                            <div className="flex items-center gap-0.5 text-[10px] leading-none">
                              {renderStars(s.vote_average)}
                            </div>
                            <span className="text-blue-400 text-xs font-semibold">
                              {safeAvg(typeof s.vote_average === 'number' ? s.vote_average : 0)}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[10px] text-gray-300">
                            {getGenreName(s.genre_ids)} • {year(s.release_date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 기존 모바일 리뷰 UI */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <p className="text-gray-300 text-sm text-center leading-relaxed">
                    리뷰를 작성하려면 영화를 충분히 감상해주세요
                  </p>
                  <p className="text-gray-400 text-xs text-center mt-1">
                    작성하신 소중한 리뷰는 다른 사용자에게 큰 도움이 됩니다.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex text-yellow-400 text-xl">
                    {[...Array(5)].map((_, i) => (<span key={i}>⭐</span>))}
                  </div>
                  <span className="text-gray-300 text-sm">135개의 평점</span>
                  <span className="text-white text-xl font-bold">4.5</span>
                </div>

                <div className="flex justify-end mb-4">
                  <span className="text-gray-400 text-sm">베스트순 ▼</span>
                </div>

                <div className="border-b border-gray-600 pb-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        <span className="text-white text-sm font-medium">민선덕</span>
                        <span className="text-gray-400 text-xs">2025년 9월 23일</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        이 영화는 어른들을 위한 동화같아요 영화관에서 아이들과 함께봤다가 
                        아이들이 다 울어서 난감했어요 그런데 영화가 자꾸 생각나고 다시 
                        고민되고 그렇 좋아하면 재혀요 간만한 영화에서 이렇게 복잡한 해요
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-400 text-sm hover:text-white">
                          <span>👍</span>
                          <span>135</span>
                        </button>
                        <button className="text-gray-400 text-sm hover:text-white">
                          <span>👎</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pb-20"></div>
          </div>
        </div>
      </div>
    </>
  )

}