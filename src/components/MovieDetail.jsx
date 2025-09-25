import api from "../api/axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null)
  useEffect(() => {
    async function getMovieDetails() {
      const res = await api.get(`${id}?language=ko-KR`);
      setMovie(res.data)
    }
    getMovieDetails()
  }, [id])/* 의존성배열의 값이 바꿀때  실행 */
  if (!movie) {
    return <div className="min-h-screen bg-black text-white flex-item-center justify-center">Loading...</div>
  }

  //영화상세정보
  return (
    <div className="min-h-screen bg-black text-white p-4 py-[80px]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-1/3 rounded-lg"
          />
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-4">{movie.overview}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-yellow-500">Release Date</h3>
                <p>{movie.release_date}</p>
              </div>
              <div>
                <h3 className="text-yellow-500">Rating</h3>
                <p>{movie.vote_average}</p>
              </div>
              <div>
                <h3 className="text-yellow-500">Runtime</h3>
                <p>{movie.runtime}분</p>
              </div>
              <div>
                <h3 className="text-yellow-500">Status</h3>
                <p>{movie.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}