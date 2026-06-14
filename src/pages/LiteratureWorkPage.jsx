import { Link, useParams } from "react-router-dom";
import WorkReader from "../components/WorkReader.jsx";
import { getWork, getAuthor, FORM_LABELS, getEra } from "../data/literature.js";

export default function LiteratureWorkPage() {
  const { slug } = useParams();
  const work = getWork(slug);

  if (!work) {
    return (
      <div className="font-body min-h-screen px-6 lg:px-10 py-16 max-w-3xl mx-auto" style={{ color: "var(--ink)" }}>
        <div className="font-display text-2xl">Work not found</div>
        <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
          This text may have moved.{" "}
          <Link to="/literature" className="underline" style={{ color: "var(--vermillion)" }}>
            Back to the library
          </Link>
          .
        </p>
      </div>
    );
  }

  const author = getAuthor(work.authorId);
  const era = getEra(work.era);
  const isDraft = work.status === "draft";

  return (
    <WorkReader
      backTo="/literature"
      backLabel="The library"
      formLabel={FORM_LABELS[work.form] ?? work.form}
      eraLabel={era ? `${era.title} · ${era.span}` : null}
      badge={isDraft ? "Draft" : null}
      title={work.title}
      titleDevanagari={work.titleDevanagari}
      authorName={author?.name}
      authorDates={author?.dates}
      noticeText={
        isDraft
          ? "This text is being prepared — the verses below are placeholders until the verified text is added."
          : null
      }
      text={work.text}
      notes={work.notes}
      source={work.source}
    />
  );
}
