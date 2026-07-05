import React, { useEffect, useMemo, useState } from "react";

const VISITOR_STORAGE_KEY = "portfolio-blog-visitor-id";
const MAX_NAME_LENGTH = 60;
const MAX_COMMENT_LENGTH = 1000;

const getInitialCounts = (counts) => ({
  thumbsUp: counts?.thumbsUp || 0,
  thumbsDown: counts?.thumbsDown || 0,
});

const getVisitorId = () => {
  const storedId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (storedId) return storedId;

  const nextId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(VISITOR_STORAGE_KEY, nextId);
  return nextId;
};

const BlogReactions = ({ post }) => {
  const [visitorId, setVisitorId] = useState("");
  const [selectedReaction, setSelectedReaction] = useState("thumbsUp");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [counts, setCounts] = useState(() => getInitialCounts(post.reactionCounts));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const approvedComments = useMemo(() => post.comments || [], [post.comments]);

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  useEffect(() => {
    setCounts(getInitialCounts(post.reactionCounts));
  }, [post.reactionCounts]);

  const submitReaction = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName) {
      setError("Please add your name before sending your reaction.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blog-reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          visitorId,
          reaction: selectedReaction,
          name: trimmedName,
          comment: trimmedComment,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Could not save your reaction.");
      }

      setCounts(getInitialCounts(payload.reactionCounts));
      setMessage(payload.message || "Thanks. Your reaction was saved.");
      setComment("");
    } catch (requestError) {
      setError(requestError.message || "Could not save your reaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-solid border-dark/10 pt-10 dark:border-light/10">
      <div className="flex flex-col gap-8 rounded-lg border border-solid border-dark/10 p-6 dark:border-light/10 sm:p-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight lg:text-2xl">Reader reactions</h2>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-dark/70 dark:text-light/70">
            <span className="rounded-full border border-solid border-dark/15 px-4 py-2 dark:border-light/15">
              Thumbs up: {counts.thumbsUp}
            </span>
            <span className="rounded-full border border-solid border-dark/15 px-4 py-2 dark:border-light/15">
              Thumbs down: {counts.thumbsDown}
            </span>
          </div>
        </div>

        <form className="grid gap-5" onSubmit={submitReaction}>
          <div className="flex flex-wrap gap-3" aria-label="Choose a reaction">
            {[
              ["thumbsUp", "Thumbs up"],
              ["thumbsDown", "Thumbs down"],
            ].map(([value, label]) => {
              const isSelected = selectedReaction === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedReaction(value)}
                  className={`rounded-md border border-solid px-4 py-2 text-sm font-semibold transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-light dark:border-primaryDark dark:bg-primaryDark dark:text-dark"
                      : "border-dark/15 text-dark hover:border-primary dark:border-light/15 dark:text-light dark:hover:border-primaryDark"
                  }`}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <label className="grid gap-2 text-sm font-semibold text-dark dark:text-light">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, MAX_NAME_LENGTH))}
              maxLength={MAX_NAME_LENGTH}
              className="rounded-md border border-solid border-dark/15 bg-transparent px-4 py-3 text-base font-medium outline-none transition-colors focus:border-primary dark:border-light/15 dark:focus:border-primaryDark"
              placeholder="Your name"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-dark dark:text-light">
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value.slice(0, MAX_COMMENT_LENGTH))}
              maxLength={MAX_COMMENT_LENGTH}
              rows={5}
              className="resize-y rounded-md border border-solid border-dark/15 bg-transparent px-4 py-3 text-base font-medium outline-none transition-colors focus:border-primary dark:border-light/15 dark:focus:border-primaryDark"
              placeholder="Leave a comment"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !visitorId}
              className="rounded-md bg-dark px-5 py-3 text-sm font-semibold text-light transition-opacity disabled:cursor-not-allowed disabled:opacity-60 dark:bg-light dark:text-dark"
            >
              {isSubmitting ? "Saving..." : "Send reaction"}
            </button>
            {message && <p className="text-sm font-semibold text-primary dark:text-primaryDark">{message}</p>}
            {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
          </div>
        </form>

        <div>
          <h3 className="text-xl font-bold">Approved comments</h3>
          {approvedComments.length > 0 ? (
            <div className="mt-5 grid gap-4">
              {approvedComments.map((item) => (
                <article key={item._id} className="rounded-md border border-solid border-dark/10 p-4 dark:border-light/10">
                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-dark/60 dark:text-light/60">
                    <span className="text-dark dark:text-light">{item.name}</span>
                    <span>{item.reaction === "thumbsDown" ? "Thumbs down" : "Thumbs up"}</span>
                  </div>
                  <p className="mt-3 text-base font-medium leading-relaxed text-dark/75 dark:text-light/75">
                    {item.comment}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-base font-medium text-dark/65 dark:text-light/65">
              No approved comments yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogReactions;
