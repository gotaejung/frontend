import { Link } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

export default function Card({ movie, orientation = "vertical", index }) {

  const img = orientation === "horizontal"
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // 모바일 레이아웃 (767px 이하)
  if (orientation === "mobile") {
    return (
      <Link to={`/movie/${movie.id}`} className="block group">
        <div className="flex gap-3 bg-neutral-900 rounded-lg overflow-hidden">
          {/* 포스터 이미지 */}
          <div className="w-28 flex-shrink-0 relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* 컨텐츠 영역 */}
          <div className="flex-1 p-3 flex flex-col justify-center">
            <h4 className="font-bold text-base mb-2 line-clamp-2">{movie.title}</h4>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="text-[#fff7df] font-bold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              {movie.release_date && (
                <div className="text-xs text-gray-400">
                  {movie.release_date}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  const rating = typeof movie?.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : (movie?.vote_average ? Number(movie.vote_average).toFixed(1) : '0.0');

  // 세로형 레이아웃
  if (orientation === "vertical") {
    return (
      <Link to={`/movie/${movie.id}`} className="block group">
        <div className="flex gap-3 items-start">
          {/* 순위 숫자
          {index !== undefined && (
            <div className="flex-shrink-0 mt-4">
              <div className="flex items-center justify-center text-4xl font-bold text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)] animate-pulse">
                {index + 1}
              </div>
            </div>
          )} */}
          <div className="rounded-lg overflow-hidden bg-neutral-800 flex-1">

            {/* 포스터 이미지 */}
            <img
              src={img}
              alt={movie.title}
              className="w-full h-80 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 bg-neutral-800" />

            {/* 컨텐츠 영역 */}
            <div className="p-3">
              <h4 className="font-bold text-lg mb-2 truncate">{movie.title}</h4>
              <div className="flex justify-between items-center text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span className="text-[#fff7df]">{rating}</span>
                </div>
                <div className="text-[#fff7df]">
                  {movie.release_date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // 가로형 레이아웃
  if (orientation === "horizontal") {
    return (
      <Link to={`/movie/${movie.id}`} className="block group">

        <div className="flex gap-3 items-start">
          {/* {index !== undefined && (
            <div className="flex-shrink-0 mt-4">
              <div className="flex items-center justify-center text-4xl font-bold text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)] animate-pulse">
                {index + 1}
              </div>
            </div>
          )} */}
          <div className="rounded-lg overflow-hidden bg-neutral-800 flex-1">
            {/* 포스터 이미지 */}
            <img
              src={img}
              alt={movie.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />

            {/* 컨텐츠 영역 */}
            <div className="p-3">
              <h4 className="font-bold text-lg mb-2 truncate">{movie.title}</h4>
              <div className="flex justify-between items-center text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span className="text-[#fff7df]">{rating}</span>
                </div>
                <div className="text-[#fff7df]">
                  {movie.release_date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}