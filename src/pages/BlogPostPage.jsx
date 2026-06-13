import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import { getPost, formatPostDate } from "../data/blog.js";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="font-body min-h-screen px-6 lg:px-10 py-16 max-w-3xl mx-auto" style={{ color: "var(--ink)" }}>
        <div className="font-display text-2xl">Post not found</div>
        <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
          This reflection may have moved.{" "}
          <Link to="/blog" className="underline" style={{ color: "var(--vermillion)" }}>Back to the blog</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <article className="px-6 lg:px-10 pt-8 pb-14 max-w-3xl mx-auto">
        <Link to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium mb-6"
              style={{ color: "var(--vermillion-dark)" }}>
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
            {formatPostDate(post.date)}
          </span>
          {post.tags?.map((t) => (
            <span key={t} className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight">
          {post.title}
        </h1>
        {post.titleDevanagari && (
          <div className="text-lg mt-2" style={{ color: "var(--vermillion-dark)", opacity: 0.85 }}>
            {post.titleDevanagari}
          </div>
        )}
        <div className="text-xs mt-3" style={{ opacity: 0.6 }}>
          By {post.author}
        </div>

        <div className="mt-5 mb-8" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>

        {/* Body */}
        <div className="max-w-2xl">
          {post.content.map((b, i) => {
            if (b.type === "h") {
              return (
                <h2 key={i} className="font-display text-2xl mt-8 mb-2 leading-snug"
                    style={{ color: "var(--vermillion-dark)" }}>
                  {b.text}
                </h2>
              );
            }
            if (b.type === "quote") {
              return (
                <blockquote key={i} className="my-7 pl-5 font-display italic text-xl sm:text-2xl leading-snug"
                            style={{ borderLeft: "3px solid var(--vermillion)", color: "var(--vermillion-dark)" }}>
                  {b.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="text-[16px] leading-relaxed my-4" style={{ opacity: 0.82 }}>
                {b.text}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
