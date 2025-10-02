import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import App from "./App";
import MovieDetail from "./components/MovieDetail";
import SearchPage from "./components/SearchPage";
import MyPage from "./components/MyPage";
import LoginPage from "./components/LoginPage";
import KakaoCallback from "./components/KakaoCallback";
import NaverCallback from "./components/NaverCallback";
import MovieListPage from "./pages/MovieListPage";

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
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "My Page",
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
      {
        path: '/*',
        element: <App />,
      },
    ],
  },
]);

export default router;