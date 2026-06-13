import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { getSortedPosts, formatPostDate } from "../data/blog.js";

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Reflections · विचार"
        title="Blog"
        devanagari="लेख"
        description="Notes, stories and reflections from Mithila Utkarsh — on the language, the script, the festivals, and the life of Mithila carried abroad."
      />

      <section className="px-6 lg:px-10 pb-12 max-w-5xl mx-auto">
        {posts.length === 0 ? (
          <div className="rounded-3xl p-8 text-sm" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", opacity: 0.75 }}>
            No posts yet — the first reflections are on their way.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                    className="group rounded-2xl p-6 border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
                    style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
                    {formatPostDate(p.date)}
                  </span>
                  {p.tags?.map((t) => (
                    <span key={t} className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                          style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="font-display text-2xl leading-tight" style={{ color: "var(--ink)" }}>
                  {p.title}
                </div>
                {p.titleDevanagari && (
                  <div className="text-sm mt-1" style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
                    {p.titleDevanagari}
                  </div>
                )}
                <p className="text-sm mt-3 leading-relaxed flex-1" style={{ opacity: 0.75 }}>
                  {p.excerpt}
                </p>
                <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                     style={{ color: "var(--vermillion)" }}>
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
