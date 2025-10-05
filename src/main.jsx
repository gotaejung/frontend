import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router"
import './index.css'
import RootLayout from "./RootLayout"
import App from "./App"
import MovieDetail from "./components/MovieDetail"
import SearchPage from "./components/SearchPage"
import MyPage from "./components/MyPage"
import LoginPage from "./components/LoginPage"
import KakaoCallback from "./components/KakaoCallback"
import NaverCallback from "./components/NaverCallback"
import MovieListPage from "./pages/MovieListPage"
import TrailerListPage from "./pages/TrailerListPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "movies/:type",
        element: <MovieListPage />,
      },
      {
        path: "trailers",
        element: <TrailerListPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "auth/kakao/callback",
        element: <KakaoCallback />,
      },
      {
        path: "auth/naver/callback",
        element: <NaverCallback />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

