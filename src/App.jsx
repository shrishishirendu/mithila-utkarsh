import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MithilaksharPage from "./pages/MithilaksharPage.jsx";
import FestivalsPage from "./pages/FestivalsPage.jsx";
import FestivalDetailPage from "./pages/FestivalDetailPage.jsx";
import DictionaryPage from "./pages/DictionaryPage.jsx";
import PanchangPage from "./pages/PanchangPage.jsx";
import GhatkaitiPage from "./pages/GhatkaitiPage.jsx";
import MerchandisePage from "./pages/MerchandisePage.jsx";
import MembershipPage from "./pages/MembershipPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true,                element: <HomePage /> },
      { path: "learn",              element: <MithilaksharPage /> },
      { path: "dictionary",         element: <DictionaryPage /> },
      { path: "festivals",          element: <FestivalsPage /> },
      { path: "festivals/:slug",    element: <FestivalDetailPage /> },
      { path: "panchang",           element: <PanchangPage /> },
      { path: "ghatkaiti",          element: <GhatkaitiPage /> },
      { path: "shop",               element: <MerchandisePage /> },
      { path: "membership",         element: <MembershipPage /> },
      { path: "signin",             element: <SignInPage /> },
      { path: "signup",             element: <SignUpPage /> },
      { path: "profile",            element: <ProfilePage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
