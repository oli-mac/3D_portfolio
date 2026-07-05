const crypto = require("crypto");
const { createClient } = require("@sanity/client");

const MAX_NAME_LENGTH = 60;
const MAX_COMMENT_LENGTH = 1000;
const VALID_REACTIONS = new Set(["thumbsUp", "thumbsDown"]);

const sendJson = (res, status, payload) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(payload);
};

const sanitizeDocumentIdPart = (value) => value.replace(/[^a-zA-Z0-9_.-]/g, "-");

const getRequestBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  return req.body;
};

const getVisitorHash = (visitorId) =>
  crypto.createHash("sha256").update(visitorId).digest("hex");

const getClient = () =>
  createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET || "production",
    apiVersion: process.env.VITE_SANITY_API_VERSION || "2026-06-28",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
  });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { message: "Only POST requests are allowed." });
  }

  if (!process.env.VITE_SANITY_PROJECT_ID || !process.env.SANITY_WRITE_TOKEN) {
    return sendJson(res, 500, { message: "Sanity write configuration is missing." });
  }

  let body;

  try {
    body = getRequestBody(req);
  } catch (error) {
    return sendJson(res, 400, { message: "Invalid JSON body." });
  }

  const postId = typeof body.postId === "string" ? body.postId.trim() : "";
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim() : "";
  const reaction = typeof body.reaction === "string" ? body.reaction : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME_LENGTH) : "";
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, MAX_COMMENT_LENGTH) : "";

  if (!postId || !visitorId || !name || !VALID_REACTIONS.has(reaction)) {
    return sendJson(res, 400, { message: "Post, visitor, name, and reaction are required." });
  }

  try {
    const client = getClient();
    const postExists = await client.fetch('defined(*[_type == "blogPost" && _id == $postId][0]._id)', { postId });

    if (!postExists) {
      return sendJson(res, 404, { message: "Blog post was not found." });
    }

    const now = new Date().toISOString();
    const visitorHash = getVisitorHash(visitorId);
    const reactionId = `blogReaction.${sanitizeDocumentIdPart(postId)}.${visitorHash}`;

    await client
      .transaction()
      .createIfNotExists({
        _id: reactionId,
        _type: "blogReaction",
        post: { _type: "reference", _ref: postId },
        visitorHash,
        createdAt: now,
      })
      .patch(reactionId, {
        set: {
          reaction,
          name,
          comment,
          status: "pending",
          updatedAt: now,
        },
      })
      .commit();

    const reactionCounts = await client.fetch(
      `{
        "thumbsUp": count(*[_type == "blogReaction" && post._ref == $postId && reaction == "thumbsUp"]),
        "thumbsDown": count(*[_type == "blogReaction" && post._ref == $postId && reaction == "thumbsDown"])
      }`,
      { postId }
    );

    return sendJson(res, 200, {
      message: "Reaction saved. Comments appear after approval.",
      reactionCounts,
    });
  } catch (error) {
    return sendJson(res, 500, { message: "Could not save your reaction. Please try again." });
  }
};
