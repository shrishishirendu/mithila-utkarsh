import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Palette, Loader2, ImageOff, X } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import ArtMotif from "../components/ArtMotif.jsx";
import { supabase } from "../lib/supabase.js";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { DOMAINS, getFormsByDomain, ART_FORM_LABELS } from "../data/arts.js";

const GALLERY_BUCKET = "arts-gallery";

function publicImage(path) {
  if (!path) return null;
  return supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data?.publicUrl || null;
}

// ---- One art form on the index (links to its detail page) ----
function ArtFormCard({ form }) {
  const cover = form.images?.[0];
  return (
    <Link
      to={`/arts/${form.slug}`}
      className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
      style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}
    >
      <div className="aspect-[4/3] overflow-hidden grid place-items-center" style={{ background: "var(--cream-2)" }}>
        {cover ? (
          <img src={cover.src} alt={cover.alt} loading="lazy"
               className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <ArtMotif motif={form.motif} className="w-20 h-20" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-tirhuta text-xl leading-tight" style={{ color: "var(--vermillion-dark)" }} title={form.devanagari}>
          {devanagariToTirhuta(form.devanagari)}
        </div>
        <div className="font-display text-lg leading-tight mt-0.5" style={{ color: "var(--ink)" }}>{form.name}</div>
        <p className="text-sm mt-2 leading-relaxed flex-1" style={{ opacity: 0.72 }}>{form.tagline}</p>
        <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
             style={{ color: "var(--vermillion)" }}>
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

// ---- One domain: heading + its art forms ----
function DomainSection({ domain }) {
  const forms = getFormsByDomain(domain.id);
  if (forms.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: "var(--ink)" }}>{domain.title}</h2>
        <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title={domain.devanagari}>
          {devanagariToTirhuta(domain.devanagari)}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>{domain.blurb}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {forms.map((f) => <ArtFormCard key={f.id} form={f} />)}
      </div>
    </section>
  );
}

// ---- Call to contribute (Layer 3 entry point) ----
function ContributeCTA() {
  return (
    <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
         style={{ background: "var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
           style={{ background: "var(--paper)", color: "var(--vermillion)" }}>
        <Palette className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-display text-xl leading-tight">Are you an artist or maker?</div>
        <div className="text-sm mt-1" style={{ opacity: 0.78 }}>
          Share a photo of your Madhubani, sikki, sujani or any Mithila art. An editor reviews each piece, and once approved it joins the community gallery.
        </div>
      </div>
      <Link to="/arts/contribute"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
        Share your art <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ---- Shop funnel band (Layer 2) ----
function ShopBand() {
  return (
    <section className="mb-12">
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
           style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="flex-1">
          <div className="font-display text-sm uppercase tracking-[0.2em] mb-2" style={{ color: "var(--turmeric)" }}>
            Bring Mithila home
          </div>
          <p className="text-[15px] leading-relaxed" style={{ opacity: 0.88 }}>
            Love what you see? Original Madhubani paintings, sikki craft, festival kits and more — sourced from the
            makers, with attribution and a fair share to the artists.
          </p>
        </div>
        <Link to="/shop"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
              style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
          Visit the shop <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ---- Community gallery card (approved Supabase submission) ----
function GalleryCard({ row, onOpen }) {
  const url = publicImage(row.image_path);
  return (
    <button onClick={() => onOpen(row)}
            className="group text-left rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
            style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
      <div className="aspect-square overflow-hidden grid place-items-center" style={{ background: "var(--cream-2)" }}>
        {url ? (
          <img src={url} alt={row.title} loading="lazy"
               className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <ImageOff className="w-7 h-7" style={{ color: "var(--vermillion)", opacity: 0.35 }} />
        )}
      </div>
      <div className="p-4">
        <div className="font-display text-base leading-snug line-clamp-1">{row.title}</div>
        <div className="text-sm mt-0.5" style={{ color: "var(--leaf)" }}>{row.artist_name}</div>
        {row.art_form && ART_FORM_LABELS[row.art_form] && (
          <div className="text-[10px] tracking-wider uppercase mt-1.5" style={{ opacity: 0.55 }}>
            {ART_FORM_LABELS[row.art_form]}
          </div>
        )}
      </div>
    </button>
  );
}

// ---- Lightbox for a gallery piece ----
function GalleryLightbox({ row, onClose }) {
  if (!row) return null;
  const url = publicImage(row.image_path);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(27,26,46,0.7)" }} onClick={onClose}>
      <div className="rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
           style={{ background: "var(--paper)" }} onClick={(e) => e.stopPropagation()}>
        <div className="relative" style={{ background: "var(--cream-2)" }}>
          {url && <img src={url} alt={row.title} className="w-full max-h-[60vh] object-contain" />}
          <button onClick={onClose} aria-label="Close"
                  className="absolute top-3 right-3 w-9 h-9 rounded-lg grid place-items-center"
                  style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          {row.title_devanagari && (
            <div className="font-tirhuta text-2xl leading-tight" style={{ color: "var(--vermillion-dark)" }} title={row.title_devanagari}>
              {devanagariToTirhuta(row.title_devanagari)}
            </div>
          )}
          <div className="font-display text-xl leading-tight mt-0.5">{row.title}</div>
          <div className="text-sm mt-1" style={{ color: "var(--leaf)" }}>
            {row.artist_name}
            {row.location ? ` · ${row.location}` : ""}
            {row.year ? ` · ${row.year}` : ""}
          </div>
          {(row.art_form && ART_FORM_LABELS[row.art_form]) || row.medium ? (
            <div className="text-[11px] tracking-wider uppercase mt-2" style={{ opacity: 0.6 }}>
              {[ART_FORM_LABELS[row.art_form], row.medium].filter(Boolean).join(" · ")}
            </div>
          ) : null}
          {row.description && (
            <p className="text-sm mt-3 leading-relaxed whitespace-pre-line" style={{ opacity: 0.8 }}>{row.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtsPage() {
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // RLS returns only approved rows to the public.
      const { data } = await supabase
        .from("arts_submissions")
        .select("id, title, title_devanagari, artist_name, art_form, medium, description, image_path, location, year")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setGallery(data || []);
      setLoadingGallery(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Kalā evaṁ Sanskriti · कला एवं संस्कृति"
        title="Arts & Culture"
        devanagari="कला एवं संस्कृति"
        description="The living arts of Mithila — Madhubani painting, the Kohbar wedding wall, sikki and sujani craft, folk song and dance. Learn each tradition, meet its makers, and bring a piece home."
      />

      <div className="px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="mb-12">
          <ContributeCTA />
        </div>

        {DOMAINS.map((d) => <DomainSection key={d.id} domain={d} />)}

        <ShopBand />

        {/* Community gallery — the living, contributed side */}
        <section className="mb-10">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: "var(--ink)" }}>
              Community gallery
            </h2>
            <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title="कला-दीर्घा">
              {devanagariToTirhuta("कला-दीर्घा")}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
            Work shared by today's Mithila artists and makers — reviewed and welcomed into the gallery.
          </p>

          {loadingGallery ? (
            <div className="mt-5 py-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} />
            </div>
          ) : gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
              {gallery.map((row) => <GalleryCard key={row.id} row={row} onOpen={setActive} />)}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl p-6 text-sm"
                 style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", opacity: 0.85 }}>
              No community pieces yet — yours could be the first.{" "}
              <Link to="/arts/contribute" className="underline" style={{ color: "var(--vermillion)" }}>
                Share your art.
              </Link>
            </div>
          )}
        </section>

        <div className="mt-2" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </div>

      <GalleryLightbox row={active} onClose={() => setActive(null)} />
    </div>
  );
}
