import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 font-body" style={{ color: "var(--ink)" }}>
      <div className="text-center max-w-md">
        <div className="font-display text-6xl leading-none" style={{ color: "var(--vermillion-dark)" }}>404</div>
        <div className="font-display text-2xl mt-3">Page not found</div>
        <p className="text-sm mt-3" style={{ opacity: 0.7 }}>
          That page doesn't exist (or isn't ready yet). Let's get you back.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </div>
    </div>
  );
}
