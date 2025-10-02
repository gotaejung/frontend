// API 키 관리 유틸리티
export const API_KEYS = {
  TMDB: import.meta.env.VITE_TMDB_API_KEY,
  KAKAO: import.meta.env.VITE_KAKAO_API_KEY,
  NAVER: import.meta.env.VITE_NAVER_API_KEY,
};

// API 키 검증 함수
export const validateApiKeys = () => {
  const missingKeys = [];
  
  if (!API_KEYS.TMDB) {
    missingKeys.push('VITE_TMDB_API_KEY');
  }
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
    console.warn('Please check your .env file');
    return false;
  }
  
  return true;
};

// TMDB API 관련 상수
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    POSTER: 'w500',
    BACKDROP: 'w1280',
    PROFILE: 'w185'
  }
};

export default API_KEYS;
