import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import WorkReader from "../components/WorkReader.jsx";
import { FORM_LABELS, getEra } from "../data/literature.js";

export default function LiteratureContributionPage() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // RLS only returns the row if it's approved (or the viewer owns it / is admin).
      const { data } = await supabase
        .from("literature_submissions")
        .select("title, title_devanagari, author_name, era, form, body_devanagari, transliteration, translation, intro")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setWork(data || null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="font-body min-h-screen py-24 flex items-center justify-center" style={{ color: "var(--ink)" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="font-body min-h-screen px-6 lg:px-10 py-16 max-w-3xl mx-auto" style={{ color: "var(--ink)" }}>
        <div className="font-display text-2xl">Work not found</div>
        <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
          This contribution may not be published yet.{" "}
          <Link to="/literature" className="underline" style={{ color: "var(--vermillion)" }}>
            Back to the library
          </Link>
          .
        </p>
      </div>
    );
  }

  const era = getEra(work.era);

  return (
    <WorkReader
      backTo="/literature"
      backLabel="The library"
      formLabel={work.form ? FORM_LABELS[work.form] ?? work.form : null}
      eraLabel={era ? `${era.title} · ${era.span}` : null}
      badge="Contributed"
      title={work.title}
      titleDevanagari={work.title_devanagari}
      authorName={work.author_name}
      intro={work.intro}
      text={{
        devanagari: work.body_devanagari,
        transliteration: work.transliteration,
        translation: work.translation,
      }}
    />
  );
}
