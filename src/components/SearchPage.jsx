import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faFilm,
  faUsers,
  faFolder,
  faBuilding,
  faTag,
  // faTv, // TV 사용 시 주석 해제
} from '@fortawesome/free-solid-svg-icons';

export default function SearchPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [personResults, setPersonResults] = useState([]);
  const [tvResults, setTvResults] = useState([]);
  const [collectionResults, setCollectionResults] = useState([]);
  const [companyResults, setCompanyResults] = useState([]);
  const [keywordResults, setKeywordResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('multi'); // 'movie', 'person', 'tv', 'collection', 'company', 'keyword', 'multi'
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedYear, setSelectedYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('KR');
  const [adultContent, setAdultContent] = useState(false);

  // 검색 타입 옵션 (Font Awesome 사용)
  const searchTypes = [
    { value: 'multi', label: '통합 검색', icon: faMagnifyingGlass },
    { value: 'movie', label: '영화', icon: faFilm },
    /* { value: 'tv', label: 'TV 시리즈', icon: faTv }, */
    { value: 'person', label: '인물', icon: faUsers },
    { value: 'collection', label: '컬렉션', icon: faFolder },
    { value: 'company', label: '제작사', icon: faBuilding },
    { value: 'keyword', label: '키워드', icon: faTag },
  ];

  // 장르 목록 (기존과 동일)
  const genres = [
    { id: '', name: '전체' },
    { id: 28, name: '액션' },
    { id: 12, name: '모험' },
    { id: 16, name: '애니메이션' },
    { id: 35, name: '코미디' },
    { id: 80, name: '범죄' },
    { id: 99, name: '다큐멘터리' },
    { id: 18, name: '드라마' },
    { id: 10751, name: '가족' },
    { id: 14, name: '판타지' },
    { id: 36, name: '역사' },
    { id: 27, name: '공포' },
    { id: 10402, name: '음악' },
    { id: 9648, name: '미스터리' },
    { id: 10749, name: '로맨스' },
    { id: 878, name: 'SF' },
    { id: 10770, name: 'TV 영화' },
    { id: 53, name: '스릴러' },
    { id: 10752, name: '전쟁' },
    { id: 37, name: '서부' }
  ];

  // 정렬 옵션 (확장)
  const sortOptions = [
    { value: 'popularity.desc', label: '인기순 (높은순)' },
    { value: 'popularity.asc', label: '인기순 (낮은순)' },
    { value: 'vote_average.desc', label: '평점순 (높은순)' },
    { value: 'vote_average.asc', label: '평점순 (낮은순)' },
    { value: 'release_date.desc', label: '최신순' },
    { value: 'release_date.asc', label: '오래된순' },
    { value: 'title.asc', label: '제목순 (가나다)' },
    { value: 'title.desc', label: '제목순 (역순)' },
    { value: 'revenue.desc', label: '흥행순 (높은순)' },
    { value: 'vote_count.desc', label: '리뷰 많은순' }
  ];

  // 연도 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  // 지역 옵션
  const regions = [
    { code: 'KR', name: '한국' },
    { code: 'US', name: '미국' },
    { code: 'JP', name: '일본' },
    { code: 'CN', name: '중국' },
    { code: 'GB', name: '영국' },
    { code: 'FR', name: '프랑스' },
    { code: 'DE', name: '독일' },
    { code: 'IT', name: '이탈리아' },
    { code: 'ES', name: '스페인' },
    { code: 'IN', name: '인도' }
  ];

  // 통합 검색 (Multi Search)
  const handleMultiSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&page=1&include_adult=${adultContent}`
      );

      // 결과를 타입별로 분류
      const results = response.data.results;
      setSearchResults(results.filter(item => item.media_type === 'movie' && item.poster_path));
      setTvResults(results.filter(item => item.media_type === 'tv' && item.poster_path));
      setPersonResults(results.filter(item => item.media_type === 'person' && item.profile_path));
    } catch (error) {
      console.error('통합 검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // TV 시리즈 검색
  const handleTvSearch = async (query) => {
    if (!query.trim()) {
      setTvResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&page=1&include_adult=${adultContent}`
      );
      setTvResults(response.data.results.filter(tv => tv.poster_path));
    } catch (error) {
      console.error('TV 검색 실패:', error);
      setTvResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 컬렉션 검색
  const handleCollectionSearch = async (query) => {
    if (!query.trim()) {
      setCollectionResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/collection?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&page=1`
      );
      setCollectionResults(response.data.results.filter(collection => collection.poster_path));
    } catch (error) {
      console.error('컬렉션 검색 실패:', error);
      setCollectionResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 제작사 검색
  const handleCompanySearch = async (query) => {
    if (!query.trim()) {
      setCompanyResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/company?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );
      setCompanyResults(response.data.results.filter(company => company.logo_path));
    } catch (error) {
      console.error('제작사 검색 실패:', error);
      setCompanyResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 키워드 검색
  const handleKeywordSearch = async (query) => {
    if (!query.trim()) {
      setKeywordResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/keyword?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );
      setKeywordResults(response.data.results);
    } catch (error) {
      console.error('키워드 검색 실패:', error);
      setKeywordResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 고급 영화 검색 (Discover API)
  const handleAdvancedMovieSearch = async () => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&page=1&sort_by=${sortBy}&include_adult=${adultContent}&region=${selectedRegion}`;

      if (selectedGenre) url += `&with_genres=${selectedGenre}`;
      if (selectedYear) url += `&year=${selectedYear}`;
      if (minRating) url += `&vote_average.gte=${minRating}`;

      const response = await axios.get(url);
      setSearchResults(response.data.results.filter(movie => movie.poster_path));
    } catch (error) {
      console.error('고급 검색 실패:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 기존 검색 함수들...
  const handleMovieSearch = async (query) => {
    setLoading(true);
    try {
      let url;

      if (query.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&page=1&include_adult=${adultContent}&region=${selectedRegion}`;
        if (selectedYear) url += `&year=${selectedYear}`;
      } else {
        return handleAdvancedMovieSearch();
      }

      const response = await axios.get(url);
      let results = response.data.results.filter(movie => movie.poster_path);

      // 필터링 적용
      if (selectedGenre) {
        results = results.filter(movie =>
          movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
        );
      }
      if (minRating) {
        results = results.filter(movie => movie.vote_average >= parseFloat(minRating));
      }

      results = sortResults(results, sortBy);
      setSearchResults(results);
    } catch (error) {
      console.error('영화 검색 실패:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSearch = async (query) => {
    if (!query.trim()) {
      setPersonResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR&page=1&include_adult=${adultContent}`
      );
      setPersonResults(response.data.results.filter(person => person.profile_path));
    } catch (error) {
      console.error('인물 검색 실패:', error);
      setPersonResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (results, sortBy) => {
    const [field, order] = sortBy.split('.');

    return [...results].sort((a, b) => {
      let aValue, bValue;

      switch (field) {
        case 'popularity':
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
          break;
        case 'vote_average':
          aValue = a.vote_average || 0;
          bValue = b.vote_average || 0;
          break;
        case 'release_date':
          aValue = new Date(a.release_date || a.first_air_date || '1900-01-01');
          bValue = new Date(b.release_date || b.first_air_date || '1900-01-01');
          break;
        case 'title':
          aValue = a.title || a.name || '';
          bValue = b.title || b.name || '';
          break;
        case 'vote_count':
          aValue = a.vote_count || 0;
          bValue = b.vote_count || 0;
          break;
        default:
          return 0;
      }

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q =
      params.get('q') ||
      params.get('keyword') ||
      params.get('personName') ||
      (location.state && location.state.q) ||
      '';
    const hint =
      params.get('type') ||
      params.get('tab') ||
      params.get('role') ||
      (location.state && location.state.type) ||
      '';

      if (q) setSearchQuery(q);
      
    const timeoutId = setTimeout(() => {
      switch (searchType) {
        case 'multi':
          handleMultiSearch(searchQuery);
          break;
        case 'movie':
          handleMovieSearch(searchQuery);
          break;
        case 'tv':
          handleTvSearch(searchQuery);
          break;
        case 'person':
          handlePersonSearch(searchQuery);
          break;
        case 'collection':
          handleCollectionSearch(searchQuery);
          break;
        case 'company':
          handleCompanySearch(searchQuery);
          break;
        case 'keyword':
          handleKeywordSearch(searchQuery);
          break;
        default:
          break;
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType, selectedGenre, sortBy, selectedYear, minRating, selectedRegion, adultContent]);

  const clearAllResults = () => {
    setSearchResults([]);
    setPersonResults([]);
    setTvResults([]);
    setCollectionResults([]);
    setCompanyResults([]);
    setKeywordResults([]);
  };

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-amber-100">고급 검색</h1>

          {/* 검색 타입 선택 */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {searchTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSearchType(type.value)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  searchType === type.value
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

          {/* 검색 입력 */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${searchTypes.find(t => t.value === searchType)?.label} ...`}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  clearAllResults();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* 고급 필터 옵션 */}
          {(searchType === 'movie' || searchType === 'multi') && (
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-100">고급 필터</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 장르 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100">장르</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 연도 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100">개봉년도</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">전체</option>
                    {years.slice(0, 50).map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>

                {/* 최소 평점 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100">최소 평점</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">전체</option>
                    <option value="7">7점 이상</option>
                    <option value="8">8점 이상</option>
                    <option value="9">9점 이상</option>
                  </select>
                </div>

                {/* 지역 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100">지역</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {regions.map((region) => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정렬 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100">정렬</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 성인 콘텐츠 옵션 */}
              {/* <div className="mt-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={adultContent}
                    onChange={(e) => setAdultContent(e.target.checked)}
                    className="mr-2"
                  />
                  성인 콘텐츠 포함
                </label>
              </div> */}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-gray-400">검색 중...</p>
          </div>
        )}

        {/* 영화 검색 결과 */}
        {(searchType === 'movie' || searchType === 'multi') && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              🎬 영화 ({searchResults.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-amber-300">
                          ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TV 시리즈 검색 결과 */}
        {/*
        {(searchType === 'tv' || searchType === 'multi') && tvResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              📺 TV 시리즈 ({tvResults.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tvResults.map((tv) => (
                <div key={tv.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                      alt={tv.name}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs text-amber-300">
                        ⭐ {tv.vote_average?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {tv.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        */}

        {/* 인물 검색 결과 */}
        {(searchType === 'person' || searchType === 'multi') && personResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              👤 인물 ({personResults.length}명)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {personResults.map((person) => (
                <Link key={person.id} to={`/person/${person.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-amber-300">
                          ⭐ {person.popularity?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {person.known_for_department}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 컬렉션 검색 결과 */}
        {(searchType === 'collection' || searchType === 'multi') && collectionResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              📦 컬렉션 ({collectionResults.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collectionResults.map((collection) => (
                <Link key={collection.id} to={`/collection/${collection.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                        alt={collection.name}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-amber-300">
                          ⭐ {collection.vote_average?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {collection.release_date ? new Date(collection.release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 제작사 검색 결과 */}
        {(searchType === 'company' || searchType === 'multi') && companyResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              🎬 제작사 ({companyResults.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {companyResults.map((company) => (
                <Link key={company.id} to={`/company/${company.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                        alt={company.name}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-amber-300">
                          ⭐ {company.popularity?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {company.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 키워드 검색 결과 */}
        {(searchType === 'keyword' || searchType === 'multi') && keywordResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-100">
              🔑 키워드 ({keywordResults.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {keywordResults.map((keyword) => (
                <div key={keyword.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="text-sm text-amber-100">{keyword.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 결과가 없을 경우 메시지 */}
        {(searchResults.length === 0 && personResults.length === 0 && tvResults.length === 0 && collectionResults.length === 0 && companyResults.length === 0 && keywordResults.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
