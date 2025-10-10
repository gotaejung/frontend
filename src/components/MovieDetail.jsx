import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faHeart,
  faArrowUpRightFromSquare,
  faMobileScreenButton,
  faUser,
  faChevronDown,     // ▼ 유지
  faChevronUp        // ▼ 유지
} from '@fortawesome/free-solid-svg-icons';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  // ▼ 포스터 높이에 맞춰 개요 영역을 제한하기 위한 참조/상태
  const posterBoxRef = useRef(null);
  const rightTopRef = useRef(null); // 개요 위의 우측 영역 전체
  const overviewRef = useRef(null);
  const [overviewMaxPx, setOverviewMaxPx] = useState(null);
  const [overviewHasOverflow, setOverviewHasOverflow] = useState(false);
  
  // 유사 영화 카드 클릭 시 상세로 이동
  const openMovieDetail = (movieId) => {
    if (!movieId) return;
    navigate(`/movie/${movieId}`);
  };

  // ▼ 만료 아이콘 토글 상태 추가
  const [showExpiry, setShowExpiry] = useState(false);

  // 추가: 유사 영화 토글/데이터 상태
  const [similar, setSimilar] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState(null);

  /* ▼ 추가: TMDB 리뷰 상태 */
  const [reviews, setReviews] = useState([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // ▼ 리뷰 펼치기 상태
  const [expandedReview, setExpandedReview] = useState({});
  const toggleReview = (id) =>
    setExpandedReview(prev => ({ ...prev, [id]: !prev[id] }));

  // ▼ 출연진 전체 보기 모달 상태
  const [isCastOpen, setIsCastOpen] = useState(false);

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
    // id 변경 시 상태 초기화
    setShowSimilar(false);
    setSimilar([]);
    setSimilarError(null);

    setReviews([]);
    setReviewsTotal(0);
    setReviewsError(null);
    setLoadingReviews(false);

    // 만료 팝오버 닫기
    setShowExpiry(false);

    getMovieDetails();
  }, [id]);/* 의존성배열의 값이 바꿀때  실행 */

  // ▼ 데스크톱 개요 영역 높이 계산 (포스터 높이 이하로)
  useEffect(() => {
    const recalc = () => {
      const posterH = posterBoxRef.current ? posterBoxRef.current.offsetHeight : 0;
      const topH = rightTopRef.current ? rightTopRef.current.offsetHeight : 0;
      // 여백 보정값 (패딩/마진 약간 고려)
      const fudge = 12;
      const available = Math.max(0, posterH - topH - fudge);
      if (!isNaN(available) && available > 0) {
        setOverviewMaxPx(available);
        if (overviewRef.current) {
          const scrollH = overviewRef.current.scrollHeight || 0;
          setOverviewHasOverflow(scrollH > available + 4);
        } else {
          setOverviewHasOverflow(false);
        }
      } else {
        setOverviewMaxPx(null);
        setOverviewHasOverflow(false);
      }
    };

    // 초기 계산 + 리사이즈 대응
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [movie, credits, isOverviewExpanded]);

  // 다른 영화로 이동 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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
  /* ▼ 수정: 리뷰 열기 시 TMDB에서 리뷰 로드 */
  const openReviews = async () => {
    setShowSimilar(false);
    if (reviews.length || loadingReviews) return; // 이미 로드함
    setLoadingReviews(true);
    try {
      const res = await api.get(`${id}/reviews?language=ko-KR&page=1`);
      let data = res.data;
      // 한국어 없으면 영어 대체
      if (!Array.isArray(data?.results) || data.results.length === 0) {
        const en = await api.get(`${id}/reviews?language=en-US&page=1`);
        data = en.data;
      }
      setReviews(Array.isArray(data?.results) ? data.results : []);
      setReviewsTotal(typeof data?.total_results === 'number' ? data.total_results : (data?.results?.length || 0));
    } catch (e) {
      setReviewsError('리뷰를 불러오지 못했습니다.');
    } finally {
      setLoadingReviews(false);
    }
  };

  /* ▼ 리뷰 탭이 기본이므로 처음 진입 및 "유사한 영화" → "리뷰" 전환 시 자동 로드 */
  useEffect(() => {
    if (!showSimilar && reviews.length === 0 && !loadingReviews) {
      openReviews();
    }
  }, [id, showSimilar]);

  // 감독 찾기 (안전 가드)
  const director = Array.isArray(credits?.crew)
    ? credits.crew.find(person => person.job === 'Director')
    : null;

  // 캐스트 정렬/헬퍼
  const castList = Array.isArray(credits?.cast) ? [...credits.cast].sort((a,b) => (a.order ?? 999) - (b.order ?? 999)) : [];
  const getProfileUrl = (p) => (p ? `https://image.tmdb.org/t/p/w185${p}` : null);

  // ▼ 검색 필터 페이지 이동 헬퍼
  const goToFilterByPerson = (person, role) => {
    if (!person) return;
    const params = new URLSearchParams({
      q: person.name ?? '' // 통합검색 쿼리로 인물명 전달
    });
    navigate(`/search?${params.toString()}`);
  };

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

  /* ▼ 리뷰 카드 유틸 */
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('/https')) return path.slice(1);
    if (path.startsWith('/')) return `https://image.tmdb.org/t/p/w185${path}`;
    return path;
  };
  const renderReviewStars = (rating) => {
    const v = typeof rating === 'number' ? rating : 0;         // 0~10
    const filled = Math.round((v / 10) * 5);                   // 0~5
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < filled ? 'text-yellow-400' : 'text-gray-500'}>★</span>
    ));
  };
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return '-'; }
  };
  const formatUpdated = (iso) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return null; }
  };

  // ▼ 추가: 데이터 로딩 가드 (초기 null 접근 방지)
  if (!movie || !credits) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  //영화상세정보
  return (
    <>
      {/* Desktop Layout (768px+) */}
      <div className="hidden md:block min-h-screen bg-black text-white" style={{ fontFamily: 'Pretendard, sans-serif' }}>
        <div className="container mx-auto px-4 py-20">
          <div className="flex gap-8 h-full items-stretch">
            {/* Left Side - Movie Poster */}
            <div className="w-1/3 h-full">
              <div ref={posterBoxRef} className="rounded-lg h-full overflow-hidden">
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : '/no-poster.png'}
                   alt={movie.title}
                   className="block w-full h-full object-cover shadow-lg max-h-[600px]"
                />
              </div>
            </div>

            {/* Right Side - Movie Info */}
            <div className="w-2/3 h-full">
              <div className="bg-black text-white h-full flex flex-col">
                {/* Movie Title and Rating */}
                <div ref={rightTopRef} className="mb-6">
                  <h1 className="text-3xl font-bold mb-3 text-white flex items-center gap-2">
                    {movie.title}

                    {/* ▼ 토글 버튼(아래/위 화살표) */}
                    <span className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setShowExpiry(v => !v)}
                        className="text-gray-400 hover:text-white text-sm align-middle"
                        aria-expanded={showExpiry}
                        aria-label={showExpiry ? '만료정보 닫기' : '만료정보 열기'}
                      >
                        <FontAwesomeIcon icon={showExpiry ? faChevronUp : faChevronDown} />
                      </button>

                      {/* ▼ 팝오버: 텍스트만 표시 */}
                      {showExpiry && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20" role="tooltip">
                          <div className="relative bg-gray-800 border border-gray-700 shadow-xl px-3 h-8 rounded-md flex items-center justify-center">
                            <span className="text-xs font-semibold text-white whitespace-nowrap leading-none">
                              0000/00/00만료
                            </span>
                            {/* 꼬리 */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 border-l border-t border-gray-700 rotate-45" />
                          </div>
                        </div>
                      )}
                    </span>
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
                    <span className="text-white">
                      {director ? (
                        <button
                          type="button"
                          onClick={() => goToFilterByPerson(director, 'director')}
                          className="text-white hover:underline"
                          title={`${director.name} 검색`}
                        >
                          {director.name}
                        </button>
                      ) : '정보 없음'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-400 font-medium w-16">출연진</span>
                    <span className="text-white">
                      {castList.slice(0, 3).map((actor, idx) => (
                        <span key={actor.id}>
                          <button
                            type="button"
                            onClick={() => goToFilterByPerson(actor, 'cast')}
                            className="text-white hover:underline"
                            title={`${actor.name} 검색`}
                          >
                            {actor.name}
                          </button>
                          {idx < Math.min(3, castList.length) - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {castList.length > 3 && ' ...'}
                    </span>
                    {castList.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setIsCastOpen(true)}
                        className="text-white hover:underline text-sm ml-2"
                      >
                        더보기
                      </button>
                    )}
                  </div>
                </div>

                {/* Watch Button */}
                {/* Actions: Play + Icons (in one row) */}
                <div className="flex items-center gap-3 sm:gap-4 mb-8">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                    재생하기
                  </button>
                  <div className="flex gap-3 sm:gap-4">
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white" aria-label="다운로드">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faDownload} className="text-base" />
                      </div>
                    </button>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white" aria-label="찜">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faHeart} className="text-base" />
                      </div>
                    </button>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white" aria-label="공유">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-base" />
                      </div>
                    </button>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white" aria-label="모바일">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faMobileScreenButton} className="text-base" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Movie Overview (포스터 높이 이하, 더보기) */}
                <div className="mb-0 relative">
                  <div
                    ref={overviewRef}
                    className="text-gray-300 leading-relaxed"
                    style={!isOverviewExpanded && overviewMaxPx ? { maxHeight: `${overviewMaxPx}px`, overflow: 'hidden' } : undefined}
                  >
                    {movie.overview}
                  </div>
                  {/* 페이드 오버레이 */}
                  {!isOverviewExpanded && overviewHasOverflow && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
                  )}
                  {/* 더보기/접기 버튼 */}
                  {overviewHasOverflow && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setIsOverviewExpanded(v => !v)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        {isOverviewExpanded ? '접기' : '더보기'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 리뷰 섹션은 아래 전체 너비로 이동했습니다 */}
              </div>
            </div>
          </div>

          {/* Desktop: Full-width Reviews (전체 너비) */}
          <div className="mt-12">
            {/* 헤더: 리뷰 | 유사한 영화 추천 (반반, 센터 정렬, 전체 영역 클릭) */}
            <div className="grid grid-cols-2 mb-4">
              <button
                type="button"
                onClick={openReviews}
                aria-selected={!showSimilar}
                className={`w-full flex items-center justify-center gap-2 py-2 cursor-pointer select-none ${!showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <span className="font-bold text-lg">리뷰</span>
                <span className="text-blue-400">({reviewsTotal})</span>
              </button>
              <button
                type="button"
                onClick={openSimilar}
                aria-selected={showSimilar}
                className={`w-full flex items-center justify-center py-2 cursor-pointer select-none ${showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <span className="font-bold text-lg">유사한 영화 추천</span>
              </button>
            </div>

            {/* 구분선: 헤더 아래 (선택된 탭만 표시) */}
            <div className="grid grid-cols-2">
              <div className={!showSimilar ? 'border-t border-gray-600' : ''}></div>
              <div className={showSimilar ? 'border-t border-gray-600' : ''}></div>
            </div>
            <div className="pt-6">
              {/* 내용: 유사영화 or TMDB 리뷰 목록 */}
              {showSimilar ? (
                <div className="mb-6">
                  {loadingSimilar && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                  {similarError && <div className="text-red-400 text-center py-6">{similarError}</div>}
                  {!loadingSimilar && !similarError && (
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                      {similar.slice(0, 12).map(s => (
                          <div
                            key={s.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openMovieDetail(s.id)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMovieDetail(s.id); } }}
                            className="group rounded-md overflow-hidden bg-black border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
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
                  {loadingReviews && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                  {reviewsError && <div className="text-red-400 text-center py-6">{reviewsError}</div>}
                  {!loadingReviews && !reviewsError && reviews.length > 0 && (
                    <div className="space-y-6">
                      {reviews.map(r => {
                        const isOpen = !!expandedReview[r.id];
                        return (
                          <div key={r.id} className="border-b border-gray-600 pb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {getAvatarUrl(r?.author_details?.avatar_path) ? (
                                  <img src={getAvatarUrl(r.author_details.avatar_path)} alt={r.author} className="w-full h-full object-cover" />
                                ) : (<FontAwesomeIcon icon={faUser} className="text-lg text-gray-300" />)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <div className="flex text-yellow-400 text-sm">
                                    {renderReviewStars(r?.author_details?.rating)}
                                  </div>
                                  {r?.author_details?.rating != null && (
                                    <span className="text-blue-400 text-sm font-semibold">
                                      {safeAvg(r.author_details.rating)}/10
                                    </span>
                                  )}
                                  <span className="text-white font-medium">{r?.author || '익명'}</span>
                                  <span className="text-gray-400 text-sm">{formatDate(r?.created_at)}</span>
                                  {formatUpdated(r?.updated_at) && (
                                    <span className="text-gray-500 text-xs">(수정: {formatUpdated(r.updated_at)})</span>
                                  )}
                                </div>
                                <p
                                  className="text-gray-300 leading-relaxed whitespace-pre-line"
                                  style={isOpen ? undefined : {
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {r?.content}
                                </p>
                                <div className="mt-2 flex items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={() => toggleReview(r.id)}
                                    className="text-gray-400 hover:text-white text-sm"
                                  >
                                    {isOpen ? '접기' : '더보기'}
                                  </button>
                                  {r?.url && (
                                    <a
                                      href={r.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:underline text-sm"
                                    >
                                      원문 보기
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
        <div className="bg-black text-white">
          {/* Title and Meta Info */}
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-bold mb-3 text-white leading-tight flex items-center gap-2">
              {movie.title}

              {/* 모바일 제목 옆 토글 */}
              <span className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowExpiry(v => !v)}
                  className="text-gray-400 hover:text-white text-sm align-middle"
                  aria-expanded={showExpiry}
                  aria-label={showExpiry ? '만료정보 닫기' : '만료정보 열기'}
                >
                  <FontAwesomeIcon icon={showExpiry ? faChevronUp : faChevronDown} />
                </button>

                {showExpiry && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20" role="tooltip">
                    <div className="relative bg-gray-800 border border-gray-700 shadow-xl px-3 h-8 rounded-md flex items-center justify-center">
                      <span className="text-xs font-semibold text-white whitespace-nowrap leading-none">
                        0000/00/00만료
                      </span>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 border-l border-t border-gray-700 rotate-45" />
                    </div>
                  </div>
                )}
              </span>
            </h1>
            
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

          {/* Actions row: left Play, right Icons (tight gap) */}
          <div className="px-4 mb-8 flex items-center justify-between">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors">
              재생하기
            </button>
            <div className="flex items-center gap-2 sm:gap-3 ml-4">
              <button className="text-gray-300 hover:text-white" aria-label="다운로드">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500">
                  <FontAwesomeIcon icon={faDownload} className="text-base" />
                </div>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="찜">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500">
                  <FontAwesomeIcon icon={faHeart} className="text-base" />
                </div>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="공유">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500">
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-base" />
                </div>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="모바일">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500">
                  <FontAwesomeIcon icon={faMobileScreenButton} className="text-base" />
                </div>
              </button>
            </div>
          </div>

          {/* Movie Details */}
          <div className="px-4 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-sm">감독</span>
              <span className="text-white text-sm text-right flex-1 ml-4">
                {director ? (
                  <button
                    type="button"
                    onClick={() => goToFilterByPerson(director, 'director')}
                    className="text-white hover:underline"
                    title={`${director.name} 검색`}
                  >
                    {director.name}
                  </button>
                ) : '정보 없음'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-medium text-sm">출연진</span>
              <div className="text-right flex-1 ml-4">
                <span className="text-white text-sm leading-relaxed">
                  {castList.slice(0, 3).map((a, idx) => (
                    <span key={a.id}>
                      <button
                        type="button"
                        onClick={() => goToFilterByPerson(a, 'cast')}
                        className="text-white hover:underline"
                        title={`${a.name} 검색`}
                      >
                        {a.name}
                      </button>
                      {idx < Math.min(3, castList.length) - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {castList.length > 3 && ' ...'}
                </span>
                {castList.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setIsCastOpen(true)}
                    className="ml-2 text-white hover:underline text-xs align-middle"
                  >
                    더보기
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="px-4 mb-8">
            <p className="text-gray-300 leading-relaxed text-sm">
              {movie.overview}
            </p>
          </div>

          {/* Reviews Section (모바일도 동일 토글) */}
          <div className="px-4 pt-6">
            <div className="grid grid-cols-2 mb-4">
              <button
                type="button"
                onClick={openReviews}
                aria-selected={!showSimilar}
                className={`w-full flex items-center justify-center gap-2 py-2 cursor-pointer select-none ${!showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <span className="font-bold text-lg">리뷰</span>
                <span className="text-blue-400 text-sm">({reviewsTotal})</span>
              </button>
              <button
                type="button"
                onClick={openSimilar}
                aria-selected={showSimilar}
                className={`w-full flex items-center justify-center py-2 cursor-pointer select-none ${showSimilar ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <span className="font-bold text-lg">유사한 영화 추천</span>
              </button>
            </div>

            <div className="grid grid-cols-2">
              <div className={!showSimilar ? 'border-t border-gray-600' : ''}></div>
              <div className={showSimilar ? 'border-t border-gray-600' : ''}></div>
            </div>
            <div className="pt-6">
            {showSimilar ? (
              <div className="mb-6">
                {loadingSimilar && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                {similarError && <div className="text-red-400 text-center py-6">{similarError}</div>}
                {!loadingSimilar && !similarError && (
                  <div className="grid grid-cols-2 gap-3">
                    {similar.slice(0, 9).map(s => (
                        <div
                          key={s.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openMovieDetail(s.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMovieDetail(s.id); } }}
                          className="group rounded-md overflow-hidden bg-black/60 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
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
                {loadingReviews && <div className="text-gray-300 text-center py-6">불러오는 중...</div>}
                {reviewsError && <div className="text-red-400 text-center py-6">{reviewsError}</div>}

                {!loadingReviews && !reviewsError && reviews.length > 0 && (
                  <div className="space-y-6">
                    {reviews.map(r => {
                      const isOpen = !!expandedReview[r.id];
                      return (
                        <div key={r.id} className="border-b border-gray-600 pb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {getAvatarUrl(r?.author_details?.avatar_path) ? (
                                <img src={getAvatarUrl(r.author_details.avatar_path)} alt={r.author} className="w-full h-full object-cover" />
                              ) : (<FontAwesomeIcon icon={faUser} className="text-sm text-gray-300" />)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <div className="flex text-xs text-yellow-400">
                                  {renderReviewStars(r?.author_details?.rating)}
                                </div>
                                {r?.author_details?.rating != null && (
                                  <span className="text-blue-400 text-xs font-semibold">
                                    {safeAvg(r.author_details.rating)}/10
                                  </span>
                                )}
                                <span className="text-white text-sm font-medium">{r?.author || '익명'}</span>
                                <span className="text-gray-400 text-xs">{formatDate(r?.created_at)}</span>
                                {formatUpdated(r?.updated_at) && (
                                  <span className="text-gray-500 text-[11px]">(수정: {formatUpdated(r.updated_at)})</span>
                                )}
                              </div>
                              <p
                                className="text-gray-300 text-sm leading-relaxed whitespace-pre-line"
                                style={isOpen ? undefined : {
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {r?.content}
                              </p>
                              <div className="mt-2 flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleReview(r.id)}
                                  className="text-gray-400 hover:text-white text-xs"
                                >
                                  {isOpen ? '접기' : '더보기'}
                                </button>
                                {r?.url && (
                                  <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline text-xs"
                                  >
                                    원문 보기
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="pb-20"></div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* 출연진 전체 보기 모달 */}
      {isCastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCastOpen(false)} />
          <div className="relative bg-black text-white w-[92vw] max-w-3xl rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">
                출연진 전체 <span className="text-blue-400">({castList.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCastOpen(false)}
                className="text-gray-300 hover:text-white text-xl leading-none"
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {castList.map(c => (
                  <div key={c.cast_id ?? `${c.id}-${c.order}`} className="flex items-center gap-3 bg-black/50 border border-gray-700 rounded-md p-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                      {getProfileUrl(c.profile_path) ? (
                        <img
                          src={getProfileUrl(c.profile_path)}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUser} className="text-lg text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCastOpen(false);
                          goToFilterByPerson(c, 'cast');
                        }}
                        className="text-left text-sm text-white hover:underline truncate"
                        title={`${c.name} 검색`}
                      >
                        {c.name}
                      </button>
                      <p className="text-xs text-gray-400 truncate">{c.character || '배역 정보 없음'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}