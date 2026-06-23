import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart, Lock, ScrollText, Loader2, CheckCircle2, Clock, ShieldCheck,
  LogIn, UserPlus, Send, Save, Sparkles, Users, User, Phone, ImagePlus, X,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

const FREE_LIMIT = 2;
const MAX_PHOTOS = 3;
const PHOTO_BUCKET = "matrimony-photos";

// Full country dial-code list as [dial, ISO-2, name]. Flags are derived from the
// ISO code (no need to hand-type 195 emojis). NANP countries share +1.
const RAW_COUNTRIES = [
  ["+93","AF","Afghanistan"],["+355","AL","Albania"],["+213","DZ","Algeria"],["+376","AD","Andorra"],
  ["+244","AO","Angola"],["+1","AG","Antigua & Barbuda"],["+54","AR","Argentina"],["+374","AM","Armenia"],
  ["+61","AU","Australia"],["+43","AT","Austria"],["+994","AZ","Azerbaijan"],["+1","BS","Bahamas"],
  ["+973","BH","Bahrain"],["+880","BD","Bangladesh"],["+1","BB","Barbados"],["+375","BY","Belarus"],
  ["+32","BE","Belgium"],["+501","BZ","Belize"],["+229","BJ","Benin"],["+975","BT","Bhutan"],
  ["+591","BO","Bolivia"],["+387","BA","Bosnia & Herzegovina"],["+267","BW","Botswana"],["+55","BR","Brazil"],
  ["+673","BN","Brunei"],["+359","BG","Bulgaria"],["+226","BF","Burkina Faso"],["+257","BI","Burundi"],
  ["+855","KH","Cambodia"],["+237","CM","Cameroon"],["+1","CA","Canada"],["+238","CV","Cape Verde"],
  ["+236","CF","Central African Republic"],["+235","TD","Chad"],["+56","CL","Chile"],["+86","CN","China"],
  ["+57","CO","Colombia"],["+269","KM","Comoros"],["+242","CG","Congo (Republic)"],["+243","CD","Congo (DRC)"],
  ["+506","CR","Costa Rica"],["+225","CI","Côte d'Ivoire"],["+385","HR","Croatia"],["+53","CU","Cuba"],
  ["+357","CY","Cyprus"],["+420","CZ","Czechia"],["+45","DK","Denmark"],["+253","DJ","Djibouti"],
  ["+1","DM","Dominica"],["+1","DO","Dominican Republic"],["+593","EC","Ecuador"],["+20","EG","Egypt"],
  ["+503","SV","El Salvador"],["+240","GQ","Equatorial Guinea"],["+291","ER","Eritrea"],["+372","EE","Estonia"],
  ["+268","SZ","Eswatini"],["+251","ET","Ethiopia"],["+679","FJ","Fiji"],["+358","FI","Finland"],
  ["+33","FR","France"],["+241","GA","Gabon"],["+220","GM","Gambia"],["+995","GE","Georgia"],
  ["+49","DE","Germany"],["+233","GH","Ghana"],["+30","GR","Greece"],["+1","GD","Grenada"],
  ["+502","GT","Guatemala"],["+224","GN","Guinea"],["+245","GW","Guinea-Bissau"],["+592","GY","Guyana"],
  ["+509","HT","Haiti"],["+504","HN","Honduras"],["+852","HK","Hong Kong"],["+36","HU","Hungary"],
  ["+354","IS","Iceland"],["+91","IN","India"],["+62","ID","Indonesia"],["+98","IR","Iran"],
  ["+964","IQ","Iraq"],["+353","IE","Ireland"],["+972","IL","Israel"],["+39","IT","Italy"],
  ["+1","JM","Jamaica"],["+81","JP","Japan"],["+962","JO","Jordan"],["+7","KZ","Kazakhstan"],
  ["+254","KE","Kenya"],["+686","KI","Kiribati"],["+965","KW","Kuwait"],["+996","KG","Kyrgyzstan"],
  ["+856","LA","Laos"],["+371","LV","Latvia"],["+961","LB","Lebanon"],["+266","LS","Lesotho"],
  ["+231","LR","Liberia"],["+218","LY","Libya"],["+423","LI","Liechtenstein"],["+370","LT","Lithuania"],
  ["+352","LU","Luxembourg"],["+853","MO","Macau"],["+261","MG","Madagascar"],["+265","MW","Malawi"],
  ["+60","MY","Malaysia"],["+960","MV","Maldives"],["+223","ML","Mali"],["+356","MT","Malta"],
  ["+692","MH","Marshall Islands"],["+222","MR","Mauritania"],["+230","MU","Mauritius"],["+52","MX","Mexico"],
  ["+691","FM","Micronesia"],["+373","MD","Moldova"],["+377","MC","Monaco"],["+976","MN","Mongolia"],
  ["+382","ME","Montenegro"],["+212","MA","Morocco"],["+258","MZ","Mozambique"],["+95","MM","Myanmar"],
  ["+264","NA","Namibia"],["+674","NR","Nauru"],["+977","NP","Nepal"],["+31","NL","Netherlands"],
  ["+64","NZ","New Zealand"],["+505","NI","Nicaragua"],["+227","NE","Niger"],["+234","NG","Nigeria"],
  ["+850","KP","North Korea"],["+389","MK","North Macedonia"],["+47","NO","Norway"],["+968","OM","Oman"],
  ["+92","PK","Pakistan"],["+680","PW","Palau"],["+970","PS","Palestine"],["+507","PA","Panama"],
  ["+675","PG","Papua New Guinea"],["+595","PY","Paraguay"],["+51","PE","Peru"],["+63","PH","Philippines"],
  ["+48","PL","Poland"],["+351","PT","Portugal"],["+974","QA","Qatar"],["+40","RO","Romania"],
  ["+7","RU","Russia"],["+250","RW","Rwanda"],["+1","KN","Saint Kitts & Nevis"],["+1","LC","Saint Lucia"],
  ["+1","VC","Saint Vincent & Grenadines"],["+685","WS","Samoa"],["+378","SM","San Marino"],["+239","ST","São Tomé & Príncipe"],
  ["+966","SA","Saudi Arabia"],["+221","SN","Senegal"],["+381","RS","Serbia"],["+248","SC","Seychelles"],
  ["+232","SL","Sierra Leone"],["+65","SG","Singapore"],["+421","SK","Slovakia"],["+386","SI","Slovenia"],
  ["+677","SB","Solomon Islands"],["+252","SO","Somalia"],["+27","ZA","South Africa"],["+82","KR","South Korea"],
  ["+211","SS","South Sudan"],["+34","ES","Spain"],["+94","LK","Sri Lanka"],["+249","SD","Sudan"],
  ["+597","SR","Suriname"],["+46","SE","Sweden"],["+41","CH","Switzerland"],["+963","SY","Syria"],
  ["+886","TW","Taiwan"],["+992","TJ","Tajikistan"],["+255","TZ","Tanzania"],["+66","TH","Thailand"],
  ["+670","TL","Timor-Leste"],["+228","TG","Togo"],["+676","TO","Tonga"],["+1","TT","Trinidad & Tobago"],
  ["+216","TN","Tunisia"],["+90","TR","Turkey"],["+993","TM","Turkmenistan"],["+688","TV","Tuvalu"],
  ["+256","UG","Uganda"],["+380","UA","Ukraine"],["+971","AE","United Arab Emirates"],["+44","GB","United Kingdom"],
  ["+1","US","United States"],["+598","UY","Uruguay"],["+998","UZ","Uzbekistan"],["+678","VU","Vanuatu"],
  ["+39","VA","Vatican City"],["+58","VE","Venezuela"],["+84","VN","Vietnam"],["+967","YE","Yemen"],
  ["+260","ZM","Zambia"],["+263","ZW","Zimbabwe"],
];

// ISO-2 -> flag emoji (regional indicator letters).
function flagOf(iso) {
  return iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const COUNTRIES = RAW_COUNTRIES
  .map(([code, iso, name]) => ({ code, iso, name, flag: flagOf(iso) }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Pinned at the top of the picker for the Maithil diaspora.
const POPULAR = ["IN", "NP", "AU", "US", "GB", "CA", "AE", "QA", "SA", "KW", "OM", "BH", "SG", "MY", "NZ"]
  .map((iso) => COUNTRIES.find((c) => c.iso === iso)).filter(Boolean);

const DEFAULT_CC = "+91";

// Split a stored "<code> <number>" into the country code + the rest.
// Longest dial code wins (so +977 isn't read as +9/+97).
function parsePhone(contact) {
  if (!contact) return { cc: DEFAULT_CC, number: "" };
  const byLen = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  for (const c of byLen) {
    if (contact.startsWith(c.code)) return { cc: c.code, number: contact.slice(c.code.length).trim() };
  }
  return { cc: DEFAULT_CC, number: contact };
}

const BLANK = {
  full_name: "", contact_email: "",
  gender: "", looking_for: "", dob: "", birth_time: "", birth_place: "",
  height: "", mool: "", gotra: "", caste: "", education: "", profession: "",
  family: "", about: "", expectations: "",
};

export default function GhatkaitiPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("draft");
  const [form, setForm] = useState(BLANK);

  const [tab, setTab] = useState("biodata"); // 'biodata' | 'browse' | 'matches'
  const [summary, setSummary] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [matches, setMatches] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null); // { kind: 'ok'|'match'|'warn', text }
  const [photos, setPhotos] = useState([]);        // storage paths
  const [photoUrls, setPhotoUrls] = useState({});  // path -> signed url
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [phoneCc, setPhoneCc] = useState(DEFAULT_CC);
  const [phoneNumber, setPhoneNumber] = useState("");

  const approved = status === "approved";
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // ---- Load the member's own biodata ----
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("matrimony_profiles").select("*").eq("id", user.id).maybeSingle();
      if (cancelled) return;
      if (error) setError("Couldn't load your biodata. " + error.message);
      else if (data) {
        setStatus(data.status || "draft");
        setForm({
          full_name: data.full_name || "", contact_email: data.contact_email || "",
          gender: data.gender || "", looking_for: data.looking_for || "",
          dob: data.dob || "", birth_time: data.birth_time || "", birth_place: data.birth_place || "",
          height: data.height || "", mool: data.mool || "", gotra: data.gotra || "",
          caste: data.caste || "", education: data.education || "", profession: data.profession || "",
          family: data.family || "", about: data.about || "", expectations: data.expectations || "",
        });
        const parsed = parsePhone(data.contact);
        setPhoneCc(parsed.cc); setPhoneNumber(parsed.number);
        setPhotos(data.photos || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  // ---- Load summary (credits/admirers) once approved ----
  async function loadSummary() {
    const { data } = await supabase.rpc("my_matrimony_summary");
    if (data && data[0]) setSummary(data[0]);
  }
  useEffect(() => { if (user && approved) loadSummary(); }, [user, approved]);

  // ---- Resolve signed URLs for the member's own photos ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const missing = photos.filter((p) => !photoUrls[p]);
      if (missing.length === 0) return;
      const got = {};
      for (const p of missing) {
        const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(p, 3600);
        if (data?.signedUrl) got[p] = data.signedUrl;
      }
      if (!cancelled && Object.keys(got).length) setPhotoUrls((u) => ({ ...u, ...got }));
    })();
    return () => { cancelled = true; };
  }, [photos]); // eslint-disable-line react-hooks/exhaustive-deps

  async function savePhotos(next) {
    await supabase.from("matrimony_profiles").upsert({
      id: user.id, photos: next, updated_at: new Date().toISOString(),
    });
  }

  async function onAddPhoto(file) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
    if (photos.length >= MAX_PHOTOS) { setError(`You can add up to ${MAX_PHOTOS} photos.`); return; }
    setUploadingPhoto(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, { upsert: false });
    if (upErr) { setUploadingPhoto(false); setError("Upload failed. " + upErr.message); return; }
    const next = [...photos, path];
    setPhotos(next);
    await savePhotos(next);
    setUploadingPhoto(false);
  }

  async function onRemovePhoto(path) {
    const next = photos.filter((p) => p !== path);
    setPhotos(next);
    setPhotoUrls((u) => { const c = { ...u }; delete c[path]; return c; });
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    await savePhotos(next);
  }

  // ---- Lazy-load Browse / Matches when their tab opens ----
  useEffect(() => {
    if (!approved) return;
    if (tab === "browse" && candidates === null) {
      (async () => {
        const { data } = await supabase.rpc("browse_candidates");
        setCandidates(data || []);
      })();
    }
    if (tab === "matches" && matches === null) {
      (async () => {
        const { data } = await supabase.rpc("my_matches");
        const enriched = await Promise.all((data || []).map(async (m) => {
          const urls = [];
          for (const p of (m.photos || [])) {
            const { data: s } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(p, 3600);
            if (s?.signedUrl) urls.push(s.signedUrl);
          }
          return { ...m, photoUrls: urls };
        }));
        setMatches(enriched);
      })();
    }
  }, [tab, approved, candidates, matches]);

  async function save(submitForReview) {
    setSaving(true); setError(null); setSavedAt(null);
    const nextStatus = submitForReview ? "submitted" : status;
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, (typeof v === "string" ? v.trim() : v) || null])
    );
    const contact = phoneNumber.trim() ? `${phoneCc} ${phoneNumber.trim()}` : null;
    const { error } = await supabase.from("matrimony_profiles").upsert({
      id: user.id, ...clean, contact, status: nextStatus, updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { setError("Couldn't save. " + error.message); return; }
    setStatus(nextStatus);
    setSavedAt(new Date());
  }

  async function sendInterest(candidateId) {
    if (busy) return;
    setBusy(true); setFlash(null);
    const { data: result, error } = await supabase.rpc("send_interest", { candidate: candidateId });
    setBusy(false);
    if (error) { setFlash({ kind: "warn", text: "Something went wrong. " + error.message }); return; }

    if (result === "no_credits") {
      setFlash({ kind: "warn", text: "You've used your free interests. Buy credits to keep going." });
      return;
    }
    // Any successful send removes the card and refreshes counts.
    setCandidates((cs) => (cs || []).filter((c) => c.id !== candidateId));
    loadSummary();
    if (result === "mutual") {
      setMatches(null); // force refetch next time Matches opens
      setFlash({ kind: "match", text: "It's a match! You can see their contact in the Matches tab." });
    } else if (result === "sent") {
      setFlash({ kind: "ok", text: "Interest sent. If they're interested too, it becomes a match." });
    } else if (result === "already") {
      setFlash({ kind: "warn", text: "You'd already shown interest in this person." });
    } else if (result === "not_approved") {
      setFlash({ kind: "warn", text: "Your biodata needs to be approved first." });
    }
  }

  function buyCredits() {
    setFlash({ kind: "warn", text: "Credit packs are coming soon — online payment is the next thing we're adding." });
  }

  const freeLeft = summary ? Math.max(0, FREE_LIMIT - summary.free_used) : null;

  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Maithil matchmaking · घटकैती"
        title="Matrimony"
        devanagari="घटकैती"
        accentColor="var(--indigo)"
        description="Browse compatible matches as anonymous profiles and mark your interest. Your name and contact stay private — they're shared only when the interest is mutual."
      />

      <section className="px-6 lg:px-10 max-w-2xl mx-auto">
        {authLoading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !user ? (
          <SignedOutTeaser />
        ) : (
          <>
            <Tabs tab={tab} setTab={setTab} approved={approved} matchCount={summary?.matches || 0} />

            {flash && tab !== "biodata" && (
              <FlashBanner flash={flash} onClose={() => setFlash(null)} />
            )}

            {tab === "biodata" && (
              <BiodataTab
                status={status} loading={loading} form={form} set={set}
                save={save} saving={saving} error={error} savedAt={savedAt}
                photos={photos} photoUrls={photoUrls}
                onAddPhoto={onAddPhoto} onRemovePhoto={onRemovePhoto} uploadingPhoto={uploadingPhoto}
                phoneCc={phoneCc} phoneNumber={phoneNumber}
                onPhoneCc={setPhoneCc} onPhoneNumber={setPhoneNumber}
              />
            )}

            {tab === "browse" && (
              !approved ? <LockedNote /> : (
                <BrowsePanel
                  summary={summary} freeLeft={freeLeft} candidates={candidates}
                  onInterest={sendInterest} busy={busy} onBuy={buyCredits}
                />
              )
            )}

            {tab === "matches" && (
              !approved ? <LockedNote /> : <MatchesPanel matches={matches} />
            )}
          </>
        )}

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}

// ============================================================
//  Tabs
// ============================================================
function Tabs({ tab, setTab, approved, matchCount }) {
  const items = [
    ["biodata", "My biodata", User],
    ["browse", "Browse", Users],
    ["matches", "Matches", Heart],
  ];
  return (
    <div className="flex gap-2 mb-5">
      {items.map(([key, label, Icon]) => {
        const active = tab === key;
        const locked = key !== "biodata" && !approved;
        return (
          <button key={key} onClick={() => setTab(key)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors"
                  style={active
                    ? { background: "var(--ink)", color: "var(--paper)" }
                    : { background: "var(--cream-2)", color: "var(--ink)", opacity: locked ? 0.6 : 1 }}>
            {locked ? <Lock className="w-3.5 h-3.5" /> : <Icon className="w-4 h-4" />}
            <span className="hidden sm:inline">{label}</span>
            {key === "matches" && matchCount > 0 && (
              <span className="ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: active ? "var(--vermillion)" : "var(--paper)", color: active ? "var(--paper)" : "var(--vermillion-dark)" }}>
                {matchCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
//  Biodata tab (the existing form + name/contact)
// ============================================================
function BiodataTab({ status, loading, form, set, save, saving, error, savedAt,
                      photos, photoUrls, onAddPhoto, onRemovePhoto, uploadingPhoto,
                      phoneCc, phoneNumber, onPhoneCc, onPhoneNumber }) {
  return (
    <>
      <div className="rounded-3xl p-5 sm:p-6 mb-5" style={{ background: "var(--cream-2)" }}>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-semibold mb-2"
             style={{ color: "var(--indigo)" }}>
          <Lock className="w-3.5 h-3.5" /> Private until it's mutual
        </div>
        <ul className="text-sm space-y-1.5" style={{ opacity: 0.8 }}>
          <li className="flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--leaf)" }} />Others see an anonymous card (age, education, profession) — your <strong>name &amp; contact stay hidden</strong> until you both mark interest.</li>
          <li className="flex gap-2"><ScrollText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vermillion-dark)" }} />Mool &amp; Gotra follow the Maithil Panji tradition — same-lineage matches are filtered out.</li>
          <li className="flex gap-2"><Heart className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vermillion)" }} />Submit for review; once approved you can browse and mark interest.</li>
        </ul>
      </div>

      <StatusBanner status={status} />

      {loading ? (
        <Center><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); save(false); }}
              className="rounded-3xl p-6 sm:p-8 space-y-6"
              style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>

          <PhotosSection photos={photos} photoUrls={photoUrls}
                         onAddPhoto={onAddPhoto} onRemovePhoto={onRemovePhoto} uploading={uploadingPhoto} />

          <Section label="Contact (shared only on a match)">
            <TextField label="Full name" value={form.full_name} onChange={set("full_name")} placeholder="Your name" />
            <TextField label="Email / WhatsApp (optional)" value={form.contact_email} onChange={set("contact_email")} placeholder="you@email.com or WhatsApp link" />
            <PhoneField cc={phoneCc} number={phoneNumber} onCc={onPhoneCc} onNumber={onPhoneNumber} />
          </Section>

          <Section label="Basics">
            <SelectField label="I am" value={form.gender} onChange={set("gender")}
                         options={[["male", "Male"], ["female", "Female"], ["other", "Other"]]} />
            <SelectField label="Looking for" value={form.looking_for} onChange={set("looking_for")}
                         options={[["bride", "A bride"], ["groom", "A groom"]]} />
            <DateField label="Date of birth" value={form.dob} onChange={set("dob")} />
            <TextField label="Height" value={form.height} onChange={set("height")} placeholder="e.g. 5'6&quot;" />
          </Section>

          <Section label="Birth details (optional — for kundli)">
            <TextField label="Birth time" value={form.birth_time} onChange={set("birth_time")} placeholder="e.g. 04:30 AM" />
            <TextField label="Birth place" value={form.birth_place} onChange={set("birth_place")} placeholder="City / town" />
          </Section>

          <Section label="Lineage (Maithil Panji)">
            <TextField label="Mool · मूल" value={form.mool} onChange={set("mool")} placeholder="Your मूल" />
            <TextField label="Gotra · गोत्र" value={form.gotra} onChange={set("gotra")} placeholder="Your गोत्र" />
            <TextField label="Caste / sub-caste (optional)" value={form.caste} onChange={set("caste")}
                       placeholder="Leave blank if you prefer" />
          </Section>

          <Section label="Background">
            <TextField label="Education" value={form.education} onChange={set("education")} placeholder="e.g. M.Tech, Sydney" />
            <TextField label="Profession" value={form.profession} onChange={set("profession")} placeholder="What you do" />
            <TextareaField label="Family (optional)" value={form.family} onChange={set("family")}
                           placeholder="Parents, family background — anything you'd like to share" />
          </Section>

          <Section label="About">
            <TextareaField label="About you" value={form.about} onChange={set("about")}
                           placeholder="A few lines about yourself — don't include your name or contact here; those are shared only on a match." />
            <TextareaField label="Partner expectations" value={form.expectations} onChange={set("expectations")}
                           placeholder="What you're looking for in a partner" />
          </Section>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
                 style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>{error}</div>
          )}
          {savedAt && !error && (
            <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                 style={{ background: "rgba(72, 107, 60, 0.08)", color: "var(--leaf)" }}>
              <CheckCircle2 className="w-4 h-4" /> Saved.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="submit" disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                    style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--cream-2)" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save draft
            </button>
            <button type="button" disabled={saving} onClick={() => save(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                    style={{ background: "var(--vermillion)", color: "var(--paper)" }}>
              <Send className="w-4 h-4" /> Submit for review
            </button>
          </div>
        </form>
      )}
    </>
  );
}

// ============================================================
//  Browse panel
// ============================================================
function BrowsePanel({ summary, freeLeft, candidates, onInterest, busy, onBuy }) {
  const interestsLeft = summary ? freeLeft + summary.credits : null;
  const outOfInterests = summary != null && interestsLeft === 0;
  return (
    <>
      {/* Interest balance — "Buy credits" only surfaces once you're out */}
      <div className="rounded-2xl p-4 mb-5 flex flex-wrap items-center gap-x-6 gap-y-2"
           style={{ background: "var(--cream-2)" }}>
        <div className="leading-tight">
          <div className="font-display text-xl" style={{ color: "var(--indigo)" }}>
            {summary ? interestsLeft : "—"}
            <span className="font-body text-sm ml-1.5" style={{ opacity: 0.7 }}>
              {interestsLeft === 1 ? "interest left" : "interests left"}
            </span>
          </div>
          {summary && (
            <div className="text-[11px]" style={{ opacity: 0.6 }}>
              {freeLeft} free{summary.credits > 0 ? ` + ${summary.credits} credits` : ""}
            </div>
          )}
        </div>
        <Stat label="Interested in you" value={summary ? summary.admirers : "—"} />
        {outOfInterests && (
          <button onClick={onBuy}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Buy credits
          </button>
        )}
      </div>

      {candidates === null ? (
        <Center><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
      ) : candidates.length === 0 ? (
        <EmptyNote icon={Users}
          title="No matches to show right now"
          body="As more Maithil members join and are approved, compatible profiles will appear here." />
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <CandidateCard key={c.id} c={c} onInterest={() => onInterest(c.id)} busy={busy} />
          ))}
        </div>
      )}
    </>
  );
}

function CandidateCard({ c, onInterest, busy }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {c.age != null && <Chip>{c.age} yrs</Chip>}
          {c.height && <Chip>{c.height}</Chip>}
          <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{ background: "rgba(72,107,60,0.12)", color: "var(--leaf)" }}>
            <ShieldCheck className="w-3 h-3" /> Lineage ✓
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm space-y-0.5">
        {c.profession && <div><span style={{ opacity: 0.55 }}>Profession · </span>{c.profession}</div>}
        {c.education && <div><span style={{ opacity: 0.55 }}>Education · </span>{c.education}</div>}
      </div>
      {c.about && <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.78 }}>{c.about}</p>}
      {c.expectations && (
        <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.65 }}>
          <span className="text-[10px] tracking-wider uppercase mr-1" style={{ color: "var(--vermillion-dark)" }}>Wants</span>
          {c.expectations}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px]" style={{ opacity: 0.5 }}>Name &amp; contact shown only if it's mutual</span>
        <button onClick={onInterest} disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
                style={{ background: "var(--vermillion)", color: "var(--paper)" }}>
          <Heart className="w-4 h-4" /> Interested
        </button>
      </div>
    </div>
  );
}

// ============================================================
//  Matches panel
// ============================================================
function MatchesPanel({ matches }) {
  if (matches === null) return <Center><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>;
  if (matches.length === 0)
    return <EmptyNote icon={Heart} title="No matches yet"
             body="When you and someone have both marked interest, you'll meet here — with name and contact." />;
  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <div key={m.id} className="rounded-2xl p-5" style={{ background: "var(--paper)", border: "1px solid var(--leaf)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(72,107,60,0.12)", color: "var(--leaf)" }}>
              <CheckCircle2 className="w-3 h-3" /> Mutual match
            </span>
            {m.age != null && <Chip>{m.age} yrs</Chip>}
          </div>
          {m.photoUrls?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {m.photoUrls.map((url, i) => (
                <img key={i} src={url} alt="" className="w-24 h-24 rounded-xl object-cover" />
              ))}
            </div>
          )}
          <div className="font-display text-xl">{m.full_name || "—"}</div>
          {m.contact && (
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--vermillion-dark)" }}>
              <Phone className="w-3.5 h-3.5" /> {m.contact}
            </div>
          )}
          {m.contact_email && (
            <div className="mt-0.5 text-sm" style={{ opacity: 0.8 }}>{m.contact_email}</div>
          )}
          <div className="mt-2 text-sm space-y-0.5" style={{ opacity: 0.8 }}>
            {m.profession && <div><span style={{ opacity: 0.55 }}>Profession · </span>{m.profession}</div>}
            {m.education && <div><span style={{ opacity: 0.55 }}>Education · </span>{m.education}</div>}
          </div>
          {m.about && <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.78 }}>{m.about}</p>}
        </div>
      ))}
    </div>
  );
}

// ============================================================
//  Small shared bits
// ============================================================
function FlashBanner({ flash, onClose }) {
  const styles = {
    ok:    { bg: "rgba(72,107,60,0.10)",  fg: "var(--leaf)",          Icon: CheckCircle2 },
    match: { bg: "rgba(193,39,45,0.10)",  fg: "var(--vermillion-dark)", Icon: Sparkles },
    warn:  { bg: "rgba(180,58,46,0.08)",  fg: "var(--vermillion-dark)", Icon: Clock },
  };
  const s = styles[flash.kind] || styles.ok;
  const Icon = s.Icon;
  return (
    <div className="rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2 cursor-pointer"
         style={{ background: s.bg, color: s.fg }} onClick={onClose}>
      <Icon className="w-4 h-4 shrink-0" /> {flash.text}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="leading-tight">
      <div className="font-display text-xl" style={{ color: "var(--indigo)" }}>{value}</div>
      <div className="text-[10px] tracking-[0.16em] uppercase" style={{ opacity: 0.6 }}>{label}</div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>
      {children}
    </span>
  );
}

function LockedNote() {
  return (
    <EmptyNote icon={Lock} title="Approved members only"
      body="Fill in your biodata and submit it for review. Once the Ghatkaiti admin approves it, browsing and matches unlock here." />
  );
}

function EmptyNote({ icon: Icon, title, body }) {
  return (
    <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-lg mt-3">{title}</div>
      <p className="text-sm mt-1.5" style={{ opacity: 0.7 }}>{body}</p>
    </div>
  );
}

function StatusBanner({ status }) {
  const map = {
    draft:     { icon: Save,         color: "var(--ink)",             text: "Draft — not yet submitted. Fill it in and submit for review." },
    submitted: { icon: Clock,        color: "var(--vermillion-dark)", text: "Submitted — under review by the Ghatkaiti admin. Browsing unlocks once approved." },
    approved:  { icon: CheckCircle2, color: "var(--leaf)",            text: "Approved — you can now browse matches and mark interest." },
  };
  const s = map[status] || map.draft;
  const Icon = s.icon;
  return (
    <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-2 text-sm"
         style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: s.color }}>
      <Icon className="w-4 h-4 shrink-0" /> {s.text}
    </div>
  );
}

function SignedOutTeaser() {
  return (
    <div className="rounded-3xl p-8 text-center"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        <Heart className="w-5 h-5" />
      </div>
      <div className="font-display text-xl mt-4">Ghatkaiti is for members</div>
      <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
        Sign in to create your matrimony biodata. Your name and contact stay private until there's a mutual match.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link to="/signin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <LogIn className="w-4 h-4" /> Sign in
        </Link>
        <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border"
              style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
          <UserPlus className="w-4 h-4" /> Sign up
        </Link>
      </div>
    </div>
  );
}

// ---------- photos ----------
function PhotosSection({ photos, photoUrls, onAddPhoto, onRemovePhoto, uploading }) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
        Photos (shared only on a match)
      </div>
      <div className="flex flex-wrap gap-3">
        {photos.map((p) => (
          <div key={p} className="relative w-24 h-24 rounded-2xl overflow-hidden" style={{ background: "var(--cream-2)" }}>
            {photoUrls[p]
              ? <img src={photoUrls[p]} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full grid place-items-center"><Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--vermillion)" }} /></div>}
            <button type="button" onClick={() => onRemovePhoto(p)} title="Remove"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full grid place-items-center"
                    style={{ background: "rgba(27,26,46,0.6)", color: "#fff" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <label className="w-24 h-24 rounded-2xl grid place-items-center cursor-pointer text-center"
                 style={{ background: "var(--cream)", border: "1px dashed var(--cream-2)", color: "var(--vermillion-dark)" }}>
            {uploading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <span className="flex flex-col items-center gap-1 text-[11px]"><ImagePlus className="w-5 h-5" /> Add photo</span>}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
                   onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; onAddPhoto(f); }} />
          </label>
        )}
      </div>
      <p className="text-[11px]" style={{ opacity: 0.6 }}>
        Up to {MAX_PHOTOS} photos, under 5 MB each. They stay private — shown only when you and someone are mutually interested.
      </p>
    </div>
  );
}

// ---------- form building blocks ----------
function Section({ label, children }) {
  return (
    <div className="space-y-4">
      <div className="text-[11px] tracking-[0.18em] uppercase font-semibold"
           style={{ color: "var(--indigo)" }}>{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Lbl({ label }) {
  return <div className="text-[11px] tracking-[0.14em] uppercase mb-1.5" style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>{label}</div>;
}

const inputStyle = { background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" };

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
             className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
    </label>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
             className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm appearance-none" style={inputStyle}>
        <option value="">—</option>
        {options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
      </select>
    </label>
  );
}

function PhoneField({ cc, number, onCc, onNumber }) {
  return (
    <label className="block sm:col-span-2">
      <Lbl label="Phone (with country code)" />
      <div className="flex gap-2">
        <select value={cc} onChange={(e) => onCc(e.target.value)}
                className="px-2 py-3 rounded-2xl text-sm shrink-0" style={{ ...inputStyle, width: 190 }}>
          <optgroup label="Common">
            {POPULAR.map((c) => (
              <option key={"p-" + c.iso} value={c.code}>{c.name} ({c.code}) {c.flag}</option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.code}>{c.name} ({c.code}) {c.flag}</option>
            ))}
          </optgroup>
        </select>
        <input type="tel" value={number} onChange={(e) => onNumber(e.target.value)} placeholder="Phone number"
               className="flex-1 px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
      </div>
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block sm:col-span-2">
      <Lbl label={label} />
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm resize-none" style={inputStyle} />
    </label>
  );
}

function Center({ children }) {
  return <div className="py-16 flex items-center justify-center">{children}</div>;
}
