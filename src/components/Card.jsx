import { Link } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default function Card({ movie, orientation = "vertical", index }) {

  const img = orientation === "horizontal"
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;


  // 세로형 레이아웃
  if (orientation === "vertical") {
    return (
      <Link to={`/movie/${movie.id}`} className="block group">
        <div className="flex gap-3 items-start">
          {/* 순위 숫자 */}
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
              className="w-full h-80 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 bg-neutral-800" />

            {/* 컨텐츠 영역 */}
            <div className="p-3">
              <h4 className="font-bold text-lg mb-2 truncate">{movie.title}</h4>
              <div className="flex justify-between items-center text-sm text-gray-200">
                <span className="flex items-center gap-2 font-bold">
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                  <span className="text-[#fff7df]">{movie.vote_average}</span>
                  <span className="text-[#fff7df] font-bold">{movie.release_date}</span>
                </span>
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
        {/* 순위 숫자 */}
        {index !== undefined && (
          <div className="flex-shrink-0 mt-2">
            <div className="flex items-center justify-center text-3xl font-bold text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)] animate-pulse">
              {index + 1}
            </div>
          </div>
        )}
        <div className="rounded-lg overflow-hidden bg-neutral-800 flex-1">
          {/* 포스터 이미지 */}
          <img
            src={img}
            alt={movie.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* 컨텐츠 영역 */}
          <div className="p-3">
            <h4 className="font-bold text-lg mb-2 text-white line-clamp-2">{movie.title}</h4>
            <div className="flex items-center gap-2">
              {/* 별점 표시 */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faHeart}
                    className={`text-xs ${i < Math.floor(movie.vote_average / 2) ? 'text-red-400' : 'text-gray-400'}`}/>
                ))}
              </div>
              <span className="text-[#fff7df] font-bold text-sm">{movie.vote_average}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
}