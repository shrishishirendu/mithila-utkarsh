import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, Users } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import ArtMotif from "../components/ArtMotif.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { getArtForm, getDomain, getFormsByDomain } from "../data/arts.js";

export default function ArtDetailPage() {
  const { slug } = useParams();
  const form = getArtForm(slug);

  if (!form) {
    return (
      <div className="font-body min-h-screen px-6 lg:px-10 py-16 max-w-3xl mx-auto" style={{ color: "var(--ink)" }}>
        <div className="font-display text-2xl">Art form not found</div>
        <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
          This page may have moved.{" "}
          <Link to="/arts" className="underline" style={{ color: "var(--vermillion)" }}>Back to Arts & Culture</Link>.
        </p>
      </div>
    );
  }

  const domain = getDomain(form.domain);
  const cover = form.images?.[0];
  const related = getFormsByDomain(form.domain).filter((f) => f.id !== form.id);

  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <div className="px-6 lg:px-10 pt-8 max-w-4xl mx-auto">
        <Link to="/arts" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--vermillion)" }}>
          <ArrowLeft className="w-4 h-4" /> Arts & Culture
        </Link>
      </div>

      {/* Hero */}
      <section className="px-6 lg:px-10 pt-4 pb-6 max-w-4xl mx-auto">
        {domain && (
          <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
            {domain.title}
          </div>
        )}
        <h1 className="font-tirhuta text-4xl sm:text-5xl leading-[1.05] tracking-tight" style={{ color: "var(--vermillion-dark)" }} title={form.devanagari}>
          {devanagariToTirhuta(form.devanagari)}
        </h1>
        <div className="font-display text-2xl sm:text-3xl mt-2 leading-tight" style={{ color: "var(--ink)" }}>{form.name}</div>
        <div className="text-lg italic mt-1.5 leading-snug" style={{ opacity: 0.7 }}>{form.tagline}</div>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.78 }}>{form.blurb}</p>
        <div className="mt-6" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      <div className="px-6 lg:px-10 max-w-4xl mx-auto">
        {/* Image (if licensed) or motif */}
        <figure className="rounded-3xl overflow-hidden border mb-10" style={{ borderColor: "var(--cream-2)", background: "var(--cream-2)" }}>
          {cover ? (
            <>
              <img src={cover.src} alt={cover.alt} className="w-full max-h-[26rem] object-cover" />
              {(cover.credit || cover.license) && (
                <figcaption className="px-5 py-3 text-[11px] leading-snug" style={{ background: "var(--paper)", opacity: 0.7 }}>
                  {cover.title ? `“${cover.title}” · ` : ""}
                  {cover.sourceUrl ? (
                    <a href={cover.sourceUrl} target="_blank" rel="noreferrer" className="underline">{cover.credit}</a>
                  ) : cover.credit}
                  {cover.license ? `, licensed ${cover.license}` : ""}
                  {cover.sourceUrl ? ", via Wikimedia Commons." : ""}
                </figcaption>
              )}
            </>
          ) : (
            <div className="aspect-[16/7] grid place-items-center">
              <ArtMotif motif={form.motif} className="w-28 h-28" />
            </div>
          )}
        </figure>

        {/* History */}
        {form.history?.length > 0 && (
          <Section title="The story" devanagari="इतिहास">
            {form.history.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed mb-3" style={{ opacity: 0.82 }}>{p}</p>
            ))}
          </Section>
        )}

        {/* Technique */}
        {form.technique?.length > 0 && (
          <Section title="How it's made" devanagari="विधि">
            {form.technique.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed mb-3" style={{ opacity: 0.82 }}>{p}</p>
            ))}
          </Section>
        )}

        {/* Motifs / elements */}
        {form.motifs?.length > 0 && (
          <Section title="Recurring elements" devanagari="प्रतीक">
            <div className="flex flex-wrap gap-2">
              {form.motifs.map((m) => (
                <span key={m} className="text-sm px-3 py-1.5 rounded-full"
                      style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
                  {m}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Notable artists */}
        {form.artists?.length > 0 && (
          <Section title="Notable makers" devanagari="कलाकार" icon={Users}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.artists.map((a) => (
                <div key={a.name} className="rounded-2xl p-4 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                  <div className="font-display text-lg leading-tight" style={{ color: "var(--ink)" }}>{a.name}</div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ opacity: 0.75 }}>{a.note}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Shop funnel (Layer 2) */}
        {form.shopBlurb && (
          <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10"
               style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
                 style={{ background: "rgba(255,255,255,0.12)", color: "var(--turmeric)" }}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-display text-xl leading-tight">Bring it home</div>
              <p className="text-sm mt-1" style={{ opacity: 0.85 }}>{form.shopBlurb}</p>
            </div>
            <Link to="/shop"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
                  style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
              Visit the shop <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Contribute nudge */}
        <div className="rounded-2xl p-5 flex flex-wrap items-center gap-3 mb-10" style={{ background: "var(--cream-2)" }}>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg leading-tight">Make {form.name.split(" (")[0]}?</div>
            <div className="text-sm mt-0.5" style={{ opacity: 0.75 }}>Share a photo of your work for the community gallery.</div>
          </div>
          <Link to="/arts/contribute"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--ink)", color: "var(--paper)" }}>
            Share your art <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related forms in the same domain */}
        {related.length > 0 && (
          <Section title="More in this family" devanagari="आओर">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((f) => (
                <Link key={f.id} to={`/arts/${f.slug}`}
                      className="group rounded-2xl p-4 border flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                  <div className="w-12 h-12 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--cream-2)", color: "var(--vermillion)" }}>
                    <ArtMotif motif={f.motif} className="w-8 h-8" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base leading-tight truncate">{f.name}</div>
                    <div className="text-xs mt-0.5 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: "var(--vermillion)" }}>
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        <div className="mt-2" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </div>
    </div>
  );
}

function Section({ title, devanagari, icon: Icon, children }) {
  return (
    <section className="mb-9">
      <div className="flex items-center gap-2.5 mb-4">
        {Icon && <Icon className="w-4 h-4" style={{ color: "var(--vermillion)" }} />}
        <h2 className="font-display text-xl sm:text-2xl leading-tight" style={{ color: "var(--ink)" }}>{title}</h2>
        {devanagari && (
          <span className="font-tirhuta text-lg" style={{ color: "var(--vermillion-dark)", opacity: 0.85 }} title={devanagari}>
            {devanagariToTirhuta(devanagari)}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
