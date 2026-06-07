import { useState, useMemo } from "react";
import { Search, X, BookA, Sparkles, Quote, Compass } from "lucide-react";
import {
  WORDS, CATEGORIES, NATIVE_WORDS, FAKRA,
  searchWords, searchNative, searchFakra,
  getCategoryLabel,
} from "../data/dictionary.js";
import { PageHero, NotifyMe } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

// ============================================================
//  Dictionary Page — three tabs: Words / Native / Fakrā
// ============================================================

const TABS = [
  { id: "words",  label: "Words",  icon: BookA,   count: WORDS.length,        hint: "Everyday vocabulary" },
  { id: "native", label: "Native", icon: Compass, count: NATIVE_WORDS.length, hint: "Mithila-only concepts" },
  { id: "fakra",  label: "Fakrā",  icon: Quote,   count: FAKRA.length,        hint: "Idioms & proverbs" },
];

export default function DictionaryPage() {
  const [tab, setTab] = useState("words");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null); // { kind: "word"|"native"|"fakra", item }

  const switchTab = (newTab) => {
    setTab(newTab);
    setQuery("");
    setCategory("all");
  };

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Word by word, phrase by phrase"
        title={<>The starter <span className="italic" style={{ color: "var(--vermillion)" }}>Maithili</span> dictionary.</>}
        devanagari="मैथिली शब्दकोश"
        description={
          <>
            Three growing collections — everyday <em>words</em>, Mithila-only <em>native</em> concepts, and the <em>fakrā</em> (idioms and proverbs) that hold the language's wit.
            <br /><br />
            All three are starter drafts. If you spot something wrong or know a word or fakrā that belongs here, tell us — that's how this gets better.
          </>
        }
      />

      <section className="px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="rounded-3xl p-2 inline-flex gap-1 flex-wrap"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                style={active
                  ? { background: "var(--ink)", color: "var(--paper)" }
                  : { background: "transparent", color: "var(--ink)" }}>
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                <span className="text-[10px] opacity-70 ml-1">{t.count}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
          {TABS.find((t) => t.id === tab)?.hint}
        </div>
      </section>

      <section className="px-6 lg:px-10 max-w-5xl mx-auto mt-5">
        {tab === "words" && (
          <WordsTab query={query} setQuery={setQuery} category={category} setCategory={setCategory}
                    onSelect={(w) => setSelected({ kind: "word", item: w })} />
        )}
        {tab === "native" && (
          <NativeTab query={query} setQuery={setQuery}
                     onSelect={(n) => setSelected({ kind: "native", item: n })} />
        )}
        {tab === "fakra" && (
          <FakraTab query={query} setQuery={setQuery}
                    onSelect={(f) => setSelected({ kind: "fakra", item: f })} />
        )}
      </section>

      <section className="px-6 lg:px-10 max-w-5xl mx-auto mt-10">
        <div className="rounded-3xl p-6 sm:p-8"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--leaf)" }}>
            Help build this
          </div>
          <h3 className="font-display text-2xl sm:text-3xl leading-tight mb-3">
            Native words and fakrā are the soul of Maithili.
          </h3>
          <p className="text-[15px] leading-relaxed mb-3" style={{ opacity: 0.78 }}>
            Words come and go in any language, but the proverbs your grandmother said and the concepts that only exist in Mithila — those are what get lost first abroad. This module needs Maithili speakers to grow it.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ opacity: 0.78 }}>
            Submissions will go to a moderator queue (coming with the Membership module). Approved entries flow into the live dictionary.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => alert("Submission form is coming with the Membership module (Phase 1). For now, hold on to your list — we'll wire it up soon.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "var(--vermillion)", color: "var(--paper)" }}>
              <Sparkles className="w-4 h-4" /> Suggest a word
            </button>
            <button
              onClick={() => alert("Submission form is coming with the Membership module (Phase 1). For now, hold on to your list — we'll wire it up soon.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
              <Quote className="w-4 h-4" /> Suggest a fakrā
            </button>
          </div>
        </div>

        <NotifyMe
          headline="Get notified when audio, more fakrā, and verified Tirhuta land"
          subtext="Audio recordings, more proverbs, and scholar-verified Tirhuta spellings are progressively added as the community grows."
        />

        <div className="mt-8" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      {selected && <DetailModal selected={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ============================================================
//  WORDS TAB
// ============================================================

function WordsTab({ query, setQuery, category, setCategory, onSelect }) {
  const filtered = useMemo(() => {
    let result = searchWords(query);
    if (category !== "all") result = result.filter((w) => w.category === category);
    return result;
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const w of filtered) {
      if (!map.has(w.category)) map.set(w.category, []);
      map.get(w.category).push(w);
    }
    return map;
  }, [filtered]);

  return (
    <>
      <FilterBar query={query} setQuery={setQuery}
                 placeholder="Search in Maithili, English, Hindi…  e.g. 'mother', 'mai', 'मछली'" />

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill active={category === "all"} onClick={() => setCategory("all")} label="All" count={WORDS.length} />
        {CATEGORIES.map((cat) => {
          const count = WORDS.filter((w) => w.category === cat.id).length;
          return (
            <Pill key={cat.id} active={category === cat.id} onClick={() => setCategory(cat.id)}
                  label={cat.label} count={count} />
          );
        })}
      </div>

      <ResultCount n={filtered.length} total={WORDS.length} query={query}
                   filterLabel={category !== "all" ? getCategoryLabel(category) : null} />

      {filtered.length === 0 ? (
        <EmptyState message="No matches. Try a different word, or browse a category." />
      ) : (
        <div className="mt-2 space-y-8">
          {Array.from(grouped.entries()).map(([catId, words]) => (
            <div key={catId}>
              <CategoryHeading label={getCategoryLabel(catId)} count={words.length} />
              <div className="grid sm:grid-cols-2 gap-3">
                {words.map((word) => (
                  <WordCard key={word.id} word={word} onClick={() => onSelect(word)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
//  NATIVE TAB
// ============================================================

function NativeTab({ query, setQuery, onSelect }) {
  const filtered = useMemo(() => searchNative(query), [query]);

  return (
    <>
      <FilterBar query={query} setQuery={setQuery}
                 placeholder="Search native words…  e.g. 'kohbar', 'naihar'" />

      <div className="mt-3 rounded-xl p-3 text-xs leading-relaxed"
           style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", color: "var(--ink)", opacity: 0.75 }}>
        <span className="font-semibold">Native words</span> are concepts that exist in Mithila but have no real Hindi equivalent — words you can't translate, only explain. These are what gets lost first when families move abroad.
      </div>

      <ResultCount n={filtered.length} total={NATIVE_WORDS.length} query={query} />

      {filtered.length === 0 ? (
        <EmptyState message="No matches in the native words yet." />
      ) : (
        <div className="mt-2 space-y-3">
          {filtered.map((n) => (
            <NativeCard key={n.id} item={n} onClick={() => onSelect(n)} />
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
//  FAKRĀ TAB
// ============================================================

function FakraTab({ query, setQuery, onSelect }) {
  const filtered = useMemo(() => searchFakra(query), [query]);

  return (
    <>
      <FilterBar query={query} setQuery={setQuery}
                 placeholder="Search proverbs…  e.g. 'rotī', 'water', 'pāni'" />

      <div className="mt-3 rounded-xl p-3 text-xs leading-relaxed"
           style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", color: "var(--ink)", opacity: 0.75 }}>
        <span className="font-semibold">Fakrā</span> are Maithili idioms, sayings, and proverbs. They don't translate cleanly — that's the point. Each carries village wit and the voice of elders. Starter list of {FAKRA.length}; many more to add with the community.
      </div>

      <ResultCount n={filtered.length} total={FAKRA.length} query={query} />

      {filtered.length === 0 ? (
        <EmptyState message="No matches in the fakrā yet." />
      ) : (
        <div className="mt-2 space-y-3">
          {filtered.map((f) => (
            <FakraCard key={f.id} item={f} onClick={() => onSelect(f)} />
          ))}
        </div>
      )}
    </>
  );
}

// ============================================================
//  Shared sub-components
// ============================================================

function FilterBar({ query, setQuery, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--vermillion)", opacity: 0.6 }} />
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
             placeholder={placeholder}
             className="w-full pl-12 pr-12 py-3.5 rounded-2xl text-base"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }} />
      {query && (
        <button onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/5"
                aria-label="Clear search">
          <X className="w-4 h-4" style={{ opacity: 0.6 }} />
        </button>
      )}
    </div>
  );
}

function Pill({ active, onClick, label, count }) {
  return (
    <button onClick={onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={active
              ? { background: "var(--ink)", color: "var(--paper)" }
              : { background: "var(--cream-2)", color: "var(--ink)" }}>
      <span>{label}</span>
      <span className="opacity-60">{count}</span>
    </button>
  );
}

function ResultCount({ n, total, query, filterLabel }) {
  return (
    <div className="mt-4 text-xs" style={{ opacity: 0.6 }}>
      Showing {n} of {total}
      {query && <> matching "<span className="font-semibold" style={{ color: "var(--vermillion-dark)" }}>{query}</span>"</>}
      {filterLabel && <> in <span className="font-semibold">{filterLabel}</span></>}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="mt-4 rounded-2xl p-8 text-center"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <BookA className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--vermillion)", opacity: 0.4 }} />
      <div className="text-sm" style={{ opacity: 0.65 }}>{message}</div>
    </div>
  );
}

function CategoryHeading({ label, count }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="font-display text-lg tracking-tight" style={{ color: "var(--vermillion-dark)" }}>{label}</h2>
      <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--cream-2)", opacity: 0.8 }}>{count}</span>
    </div>
  );
}

// ============================================================
//  Cards
// ============================================================

function WordCard({ word, onClick }) {
  return (
    <button onClick={onClick}
            className="text-left p-4 rounded-2xl transition-all hover:shadow-md hover:-translate-y-px"
            style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <div className="font-display text-2xl leading-none" style={{ color: "var(--ink)" }}>{word.dev}</div>
            {word.tirhuta && (
              <div className="font-tirhuta text-xl leading-none" style={{ color: "var(--vermillion)" }}>{word.tirhuta}</div>
            )}
          </div>
          <div className="mt-1.5 text-sm italic flex items-baseline gap-2 flex-wrap">
            <span style={{ color: "var(--vermillion-dark)" }}>{word.iast}</span>
            <span className="text-[10px] tracking-wider uppercase not-italic" style={{ opacity: 0.5 }}>{word.pos}</span>
          </div>
          <div className="mt-2 text-sm" style={{ color: "var(--ink)", opacity: 0.85 }}>
            {Array.isArray(word.english) ? word.english.join(" · ") : word.english}
          </div>
        </div>
        {word.distinctive && (
          <span className="text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "var(--turmeric)", color: "var(--ink)", opacity: 0.9 }}
                title="Distinctively Maithili — differs from Hindi">
            Maithili
          </span>
        )}
      </div>
    </button>
  );
}

function NativeCard({ item, onClick }) {
  return (
    <button onClick={onClick}
            className="text-left w-full p-5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-px"
            style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        <div className="font-display text-3xl leading-none" style={{ color: "var(--ink)" }}>{item.dev}</div>
        <div className="text-base italic" style={{ color: "var(--vermillion-dark)" }}>{item.iast}</div>
      </div>
      <div className="text-sm font-semibold" style={{ color: "var(--vermillion-dark)" }}>{item.short}</div>
      <div className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--ink)", opacity: 0.78 }}>
        {item.explanation}
      </div>
      <div className="mt-3 text-[10px] tracking-wider uppercase" style={{ color: "var(--vermillion)", opacity: 0.7 }}>
        Read more →
      </div>
    </button>
  );
}

function FakraCard({ item, onClick }) {
  return (
    <button onClick={onClick}
            className="text-left w-full p-5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-px relative overflow-hidden"
            style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
      <Quote className="absolute top-3 right-3 w-5 h-5" style={{ color: "var(--vermillion)", opacity: 0.25 }} />
      <div className="font-display text-xl sm:text-2xl leading-snug mb-2 pr-8" style={{ color: "var(--ink)" }}>{item.dev}</div>
      <div className="text-sm italic mb-3" style={{ color: "var(--vermillion-dark)" }}>{item.iast}</div>
      <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.85 }}>
        <span className="font-semibold">Literally:</span> {item.literal}
      </div>
      <div className="mt-1 text-sm" style={{ color: "var(--ink)", opacity: 0.85 }}>
        <span className="font-semibold">Means:</span> {item.meaning}
      </div>
    </button>
  );
}

// ============================================================
//  Unified detail modal
// ============================================================

function DetailModal({ selected, onClose }) {
  const { kind, item } = selected;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
         style={{ background: "rgba(27, 26, 46, 0.5)" }}
         onClick={onClose}>
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
           style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", maxHeight: "90vh" }}
           onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-black/5"
                aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        {kind === "word"   && <WordDetail   word={item} />}
        {kind === "native" && <NativeDetail item={item} />}
        {kind === "fakra"  && <FakraDetail  item={item} />}
      </div>
    </div>
  );
}

function WordDetail({ word }) {
  return (
    <>
      <div className="p-6 pb-4" style={{ background: "var(--paper)" }}>
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2"
             style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
          {getCategoryLabel(word.category)} · {word.pos}
        </div>
        <div className="font-display text-5xl leading-tight" style={{ color: "var(--ink)" }}>{word.dev}</div>
        {word.tirhuta ? (
          <div className="font-tirhuta text-3xl mt-2" style={{ color: "var(--vermillion)" }}>{word.tirhuta}</div>
        ) : (
          <div className="text-xs italic mt-2" style={{ opacity: 0.5 }}>Tirhuta spelling pending community review</div>
        )}
        <div className="text-lg italic mt-2" style={{ color: "var(--vermillion-dark)" }}>{word.iast}</div>
        {word.distinctive && (
          <div className="inline-block mt-3 text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full"
               style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
            Distinctively Maithili
          </div>
        )}
      </div>
      <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
        <DetailRow label="Meaning" value={Array.isArray(word.english) ? word.english.join(", ") : word.english} />
        {word.hindi && <DetailRow label="Hindi" value={word.hindi} />}
        {word.note && <DetailRow label="Note" value={word.note} multiline />}
        <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--cream-2)" }}>
          <button onClick={() => alert("Audio recordings are coming in Phase 1.")}
                  className="text-xs tracking-wider uppercase"
                  style={{ color: "var(--leaf)", opacity: 0.9 }}>
            🔊 Hear pronunciation · coming soon
          </button>
        </div>
      </div>
    </>
  );
}

function NativeDetail({ item }) {
  return (
    <>
      <div className="p-6 pb-4" style={{ background: "var(--paper)" }}>
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2"
             style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
          Native to Mithila
        </div>
        <div className="font-display text-5xl leading-tight" style={{ color: "var(--ink)" }}>{item.dev}</div>
        <div className="text-lg italic mt-2" style={{ color: "var(--vermillion-dark)" }}>{item.iast}</div>
        <div className="mt-3 text-sm font-semibold" style={{ color: "var(--ink)" }}>{item.short}</div>
      </div>
      <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
        <DetailRow label="What it means" value={item.explanation} multiline />
        {item.seeAlso && item.seeAlso.length > 0 && (
          <DetailRow label="See also" value={item.seeAlso.join(", ")} />
        )}
      </div>
    </>
  );
}

function FakraDetail({ item }) {
  return (
    <>
      <div className="p-6 pb-4 relative" style={{ background: "var(--paper)" }}>
        <Quote className="absolute right-12 top-4 w-10 h-10" style={{ color: "var(--vermillion)", opacity: 0.18 }} />
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2"
             style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
          Fakrā · Maithili saying
        </div>
        <div className="font-display text-2xl sm:text-3xl leading-snug" style={{ color: "var(--ink)" }}>{item.dev}</div>
        <div className="text-base italic mt-3" style={{ color: "var(--vermillion-dark)" }}>{item.iast}</div>
      </div>
      <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
        <DetailRow label="Literally" value={item.literal} />
        <DetailRow label="What it means" value={item.meaning} multiline />
        {item.context && <DetailRow label="When it's used" value={item.context} multiline />}
        <div className="mt-6 pt-5 border-t text-xs italic"
             style={{ borderColor: "var(--cream-2)", opacity: 0.6 }}>
          Draft entry — pending community verification.
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value, multiline }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] tracking-[0.2em] uppercase mb-1"
           style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
        {label}
      </div>
      <div className={multiline ? "text-sm leading-relaxed" : "text-base"}
           style={{ color: "var(--ink)" }}>
        {value}
      </div>
    </div>
  );
}
