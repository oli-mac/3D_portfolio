import React, { useEffect, useMemo, useRef, useState } from "react";

const VISITOR_STORAGE_KEY = "portfolio-blog-visitor-id";
const REACTION_STORAGE_PREFIX = "portfolio-blog-reaction";
const MAX_NAME_LENGTH = 60;
const MAX_COMMENT_LENGTH = 1000;

const getInitialCounts = (counts) => ({
  thumbsUp: counts?.thumbsUp || 0,
  thumbsDown: counts?.thumbsDown || 0,
});

const readJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (parseError) {
    return {};
  }
};

const ThumbIcon = ({ down = false, className = "" }) => (
  <svg
    className={`${down ? "rotate-180" : ""} ${className}`}
    aria-hidden="true"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 10v10M7 10H4.8c-1 0-1.8.8-1.8 1.8v6.4c0 1 .8 1.8 1.8 1.8H7m0-10 4.7-6.2c.8-1 2.4-.5 2.4.8v3.7h3.7c1.5 0 2.6 1.4 2.2 2.9l-1.4 5.5c-.4 1.9-2.1 3.3-4.1 3.3H7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const CommentIcon = ({ className = "" }) => (
  <svg className={className} aria-hidden="true" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.4 18.5h7.8c3.6 0 6.3-2.5 6.3-5.9S16.8 6.5 12 6.5s-7.5 2.7-7.5 6.1c0 1.6.6 2.9 1.7 4L5.4 20v-1.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ShareIcon = ({ className = "" }) => (
  <svg className={className} aria-hidden="true" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.5 11.2 15.5 7m-7 5.8 7 4.2M7 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm10-6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

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

const getReactionStorageKey = (postId) => `${REACTION_STORAGE_PREFIX}-${postId}`;

const adjustCounts = (counts, previousReaction, nextReaction) => {
  if (previousReaction === nextReaction) return counts;

  return {
    thumbsUp: counts.thumbsUp + (nextReaction === "thumbsUp" ? 1 : 0) - (previousReaction === "thumbsUp" ? 1 : 0),
    thumbsDown:
      counts.thumbsDown + (nextReaction === "thumbsDown" ? 1 : 0) - (previousReaction === "thumbsDown" ? 1 : 0),
  };
};

const ActionButton = ({ children, label, active = false, disabled = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
      active
        ? "bg-primary/10 text-primary dark:bg-primaryDark/10 dark:text-primaryDark"
        : "text-dark/60 hover:bg-dark/5 hover:text-dark dark:text-light/60 dark:hover:bg-light/10 dark:hover:text-light"
    }`}
    aria-label={label}
    aria-pressed={active}
    title={label}
  >
    {children}
  </button>
);

const BlogReactions = ({ post, onContentRefresh }) => {
  const commentsRef = useRef(null);
  const [visitorId, setVisitorId] = useState("");
  const [currentReaction, setCurrentReaction] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [counts, setCounts] = useState(() => getInitialCounts(post.reactionCounts));
  const [isReactionSaving, setIsReactionSaving] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const approvedComments = useMemo(() => post.comments || [], [post.comments]);

  useEffect(() => {
    setVisitorId(getVisitorId());
    setCurrentReaction(window.localStorage.getItem(getReactionStorageKey(post._id)));
  }, [post._id]);

  useEffect(() => {
    setCounts(getInitialCounts(post.reactionCounts));
  }, [post.reactionCounts]);

  const saveReaction = async ({ reaction, name: nextName = "Anonymous", comment: nextComment = "" }) => {
    const response = await fetch("/api/blog-reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post._id,
        visitorId,
        reaction,
        name: nextName,
        comment: nextComment,
      }),
    });

    const payload = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(payload.message || `Could not save your reaction. Server returned ${response.status}.`);
    }

    return payload;
  };

  const handleReactionClick = async (reaction) => {
    if (!visitorId || isReactionSaving) return;

    setMessage("");
    setError("");

    const previousReaction = currentReaction;
    const previousCounts = counts;
    setCurrentReaction(reaction);
    setCounts((value) => adjustCounts(value, previousReaction, reaction));
    window.localStorage.setItem(getReactionStorageKey(post._id), reaction);
    setIsReactionSaving(true);

    try {
      const payload = await saveReaction({ reaction });
      setCounts(getInitialCounts(payload.reactionCounts));
      setMessage(payload.message || "Reaction saved.");
      onContentRefresh?.();
    } catch (requestError) {
      setCurrentReaction(previousReaction);
      setCounts(previousCounts);
      if (previousReaction) {
        window.localStorage.setItem(getReactionStorageKey(post._id), previousReaction);
      } else {
        window.localStorage.removeItem(getReactionStorageKey(post._id));
      }
      setError(requestError.message || "Could not save your reaction. Please try again.");
    } finally {
      setIsReactionSaving(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      setError("Please add your name and comment before sending.");
      return;
    }

    setIsCommentSubmitting(true);

    try {
      const reaction = currentReaction || "thumbsUp";
      const payload = await saveReaction({ reaction, name: trimmedName, comment: trimmedComment });
      setCurrentReaction(reaction);
      window.localStorage.setItem(getReactionStorageKey(post._id), reaction);
      setCounts(getInitialCounts(payload.reactionCounts));
      setMessage(payload.message || "Comment saved. It will appear after approval.");
      setComment("");
      onContentRefresh?.();
    } catch (requestError) {
      setError(requestError.message || "Could not save your comment. Please try again.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sharePost = async () => {
    setMessage("");
    setError("");

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch (shareError) {
      setError("Could not share this post. Please copy the link from your browser.");
    }
  };

  return (
    <section className="mt-14 border-y border-solid border-dark/10 py-8 dark:border-light/10">
      <div className="flex flex-wrap items-center justify-between gap-4 text-dark dark:text-light">
        <div className="flex flex-wrap items-center gap-1">
          <ActionButton
            active={currentReaction === "thumbsUp"}
            disabled={isReactionSaving || !visitorId}
            label="Thumbs up"
            onClick={() => handleReactionClick("thumbsUp")}
          >
            <ThumbIcon className="h-5 w-5" />
            <span>{counts.thumbsUp}</span>
          </ActionButton>
          <ActionButton
            active={currentReaction === "thumbsDown"}
            disabled={isReactionSaving || !visitorId}
            label="Thumbs down"
            onClick={() => handleReactionClick("thumbsDown")}
          >
            <ThumbIcon down className="h-5 w-5" />
            <span>{counts.thumbsDown}</span>
          </ActionButton>
          <ActionButton label="Comments" onClick={scrollToComments}>
            <CommentIcon className="h-5 w-5" />
            <span>{approvedComments.length}</span>
          </ActionButton>
        </div>

        <ActionButton label="Share" onClick={sharePost}>
          <ShareIcon className="h-5 w-5" />
        </ActionButton>
      </div>

      {(message || error) && (
        <div className="mt-4">
          {message && <p className="text-sm font-semibold text-primary dark:text-primaryDark">{message}</p>}
          {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}
        </div>
      )}

      <div ref={commentsRef} className="mt-10 scroll-mt-28">
        <h3 className="text-2xl font-bold">Comments</h3>
        {approvedComments.length > 0 ? (
          <div className="mt-6 divide-y divide-dark/10 border-y border-solid border-dark/10 dark:divide-light/10 dark:border-light/10">
            {approvedComments.map((item) => (
              <article key={item._id} className="py-5">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-dark/55 dark:text-light/55">
                  <span className="text-dark dark:text-light">{item.name}</span>
                  <span
                    aria-label={item.reaction === "thumbsDown" ? "Thumbs down" : "Thumbs up"}
                    title={item.reaction === "thumbsDown" ? "Thumbs down" : "Thumbs up"}
                  >
                    <ThumbIcon down={item.reaction === "thumbsDown"} className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-base font-medium leading-relaxed text-dark/75 dark:text-light/75">
                  {item.comment}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-base font-medium text-dark/65 dark:text-light/65">No comments yet.</p>
        )}
      </div>

      <form className="mt-8 grid gap-5" onSubmit={submitComment}>
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
            rows={4}
            className="resize-y rounded-md border border-solid border-dark/15 bg-transparent px-4 py-3 text-base font-medium outline-none transition-colors focus:border-primary dark:border-light/15 dark:focus:border-primaryDark"
            placeholder="Leave a comment"
            required
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isCommentSubmitting || !visitorId}
            className="rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-light transition-opacity disabled:cursor-not-allowed disabled:opacity-60 dark:bg-light dark:text-dark"
          >
            {isCommentSubmitting ? "Saving..." : "Respond"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BlogReactions;
