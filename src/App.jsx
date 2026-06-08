import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MithilaksharPage from "./pages/MithilaksharPage.jsx";
import FestivalsPage from "./pages/FestivalsPage.jsx";
import FestivalDetailPage from "./pages/FestivalDetailPage.jsx";
import DictionaryPage from "./pages/DictionaryPage.jsx";
import TirhutaPage from "./pages/TirhutaPage.jsx";
import TranslatePage from "./pages/TranslatePage.jsx";
import PanchangPage from "./pages/PanchangPage.jsx";
import GhatkaitiPage from "./pages/GhatkaitiPage.jsx";
import MerchandisePage from "./pages/MerchandisePage.jsx";
import MembershipPage from "./pages/MembershipPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminWordsPage from "./pages/AdminWordsPage.jsx";
import LiteraturePage from "./pages/LiteraturePage.jsx";
import ArtsPage from "./pages/ArtsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true,                element: <HomePage /> },
      { path: "learn",              element: <MithilaksharPage /> },
      { path: "dictionary",         element: <DictionaryPage /> },
      { path: "tirhuta",            element: <TirhutaPage /> },
      { path: "translate",          element: <TranslatePage /> },
      { path: "festivals",          element: <FestivalsPage /> },
      { path: "festivals/:slug",    element: <FestivalDetailPage /> },
      { path: "panchang",           element: <PanchangPage /> },
      { path: "ghatkaiti",          element: <GhatkaitiPage /> },
      { path: "shop",               element: <MerchandisePage /> },
      { path: "literature",         element: <LiteraturePage /> },
      { path: "arts",               element: <ArtsPage /> },
      { path: "membership",         element: <MembershipPage /> },
      { path: "members",            element: <MembersPage /> },
      { path: "signin",             element: <SignInPage /> },
      { path: "signup",             element: <SignUpPage /> },
      { path: "profile",            element: <ProfilePage /> },
      { path: "admin/words",        element: <AdminWordsPage /> },
      { path: "*",                  element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}
