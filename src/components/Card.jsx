import { Link } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default function Card({ movie, orientation = "vertical" }) {

  const img = orientation === "horizontal" 
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` 
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  
  
  // 세로형 레이아웃
  if (orientation === "vertical") {
    return (
      <Link to={`/movie/${movie.id}`} className="block group">
        <img src={img} alt={movie.title} className="w-full rounded-md transition-transform duration-300 group-hover:scale-105 bg-neutral-800" />
        <h4 className="font-bold mt-3 mb-1 text-lg truncate">{movie.title}</h4>
        <div className="flex justify-between item-center text-sm text-gray-200">
          <span className="flex items-center gap-2 font-bold">
            <FontAwesomeIcon icon={faHeart} className="text-yellow-500" />
            <span className="text-yellow-500">{movie.vote_average}</span>
            <span className="text-yellow-500 font-bold">{movie.release_date}</span>
          </span>
        </div>
      </Link>
    )
  }
  
  // 가로형 레이아웃
if (orientation === "horizontal") {
  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="rounded-lg overflow-hidden bg-neutral-800">
        {/* 포스터 이미지 */}
        <img 
          src={img} 
          alt={movie.title} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {/* 컨텐츠 영역 - 바로 붙어있음 */}
        <div className="p-3">
          <h4 className="font-bold text-lg mb-2 text-white line-clamp-2">{movie.title}</h4>
          
          <div className="flex items-center gap-2">
            {/* 별점 표시 */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon 
                  key={i}
                  icon={faHeart} 
                  className={`text-xs ${i < Math.floor(movie.vote_average / 2) ? 'text-yellow-400' : 'text-gray-400'}`}
                />
              ))}
            </div>
            <span className="text-yellow-400 font-bold text-sm">{movie.vote_average}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
}