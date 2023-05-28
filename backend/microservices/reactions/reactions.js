const checkAuth = require("./auth/checkAuth");
const pool = require("./database/db");
const sanitize = require("xss");

module.exports = {
  Query: {
    getLikes: async (_, { post_id }) => {
      const sanitizedPostId = sanitize(post_id);

      let likeCount = await pool.query(
        "SELECT (SELECT COUNT(*) FROM likes WHERE positive = true AND post_id = $1) - (SELECT COUNT(*) FROM dislikes WHERE positive = false AND post_id = $1) AS DEEZ",
        [sanitizedPostId]
      );
      let likes = await pool.query("SELECT * FROM likes WHERE post_id = $1", [
        sanitizedPostId,
      ]);
      let dislikes = await pool.query(
        "SELECT * FROM dislikes WHERE post_id = $1",
        [sanitizedPostId]
      );

      return {
        likeCount: likeCount.rows[0].deez,
        likes: likes.rows,
        dislikes: dislikes.rows,
      };
    },
    getCommentLikes: async (_, { comment_id }) => {
      const sanitizedCommentId = sanitize(comment_id);

      let likeCount = await pool.query(
        "SELECT (SELECT COUNT(*) FROM commentlikes WHERE comment_id = $1) - (SELECT COUNT(*) FROM commentdislikes WHERE comment_id = $1) AS DEEZ",
        [sanitizedCommentId]
      );
      let likes = await pool.query(
        "SELECT * FROM commentlikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );
      let dislikes = await pool.query(
        "SELECT * FROM commentdislikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );

      return {
        likeCount: likeCount.rows[0].deez,
        likes: likes.rows,
        dislikes: dislikes.rows,
      };
    },
    getComments: async (_, { post_id }) => {
      const sanitizedPostId = sanitize(post_id);
      const getCommentsQuery = await pool.query(
        "SELECT * FROM comments WHERE post_id = $1",
        [sanitizedPostId]
      );
      return getCommentsQuery.rows;
    },
  },
  Mutation: {
    async createComment(_, { post_id, text }, context) {
      const user = checkAuth(context);
      const sanitizedText = sanitize(text);
      const sanitizedPostId = sanitize(post_id);

      const writeCommentQuery = await pool.query(
        "INSERT INTO comments(user_id,text,post_id,created_at,profilepic,name) VALUES($1,$2,$3,$4,$5,$6) RETURNING * ",
        [
          user.user_id,
          sanitizedText,
          sanitizedPostId,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          user.profilepic,
          user.name,
        ]
      );
      return writeCommentQuery.rows[0];
    },
    async deleteComment(_, { comment_id }, context) {
      const user = checkAuth(context);
      const sanitizedCommentId = sanitize(comment_id);
      const getAuthorUser = await pool.query(
        "SELECT user_id FROM comments WHERE id = $1",
        [sanitizedCommentId]
      );

      if (getAuthorUser.rows[0].user_id !== user.user_id) {
        const deleteQuery = await pool.query(
          "DELETE FROM comments WHERE id = $1 RETURNING *",
          [sanitizedCommentId]
        );
        return deleteQuery.rows[0];
      } else {
        throw new Error("Du kan ikke slette andres kommentarer");
      }
    },
    async likePost(_, { user_id, post_id }) {
      const sanitizedUserId = sanitize(user_id);
      const sanitizedPostId = sanitize(post_id);

      const getCurrentLikes = await pool.query(
        "SELECT user_id FROM likes WHERE post_id = $1",
        [sanitizedPostId]
      );
      const getCurrentDislikes = await pool.query(
        "SELECT user_id FROM dislikes WHERE post_id = $1",
        [sanitizedPostId]
      );

      if (getCurrentLikes) {
        if (
          getCurrentLikes.rows.filter((like) => like.user_id == sanitizedUserId)
            .length > 0
        ) {
          console.log("bruger har allerede liket, fjern like");
          const deleteLike = await pool.query(
            "DELETE FROM likes WHERE post_id =$1 AND user_id=$2 RETURNING *",
            [sanitizedPostId, sanitizedUserId]
          );
          return deleteLike.rows[0];
        } else if (
          getCurrentDislikes.rows.filter(
            (dislike) => dislike.user_id == sanitizedUserId
          ).length > 0
        ) {
          console.log(
            "bruger har disliked, men vælger nu at like og derfor skal dislike fjernes"
          );
          await pool.query(
            "DELETE FROM dislikes WHERE post_id = $1 AND user_id = $2",
            [sanitizedPostId, sanitizedUserId]
          );
          const like = await pool.query(
            "INSERT INTO likes(user_id, post_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedPostId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return like.rows[0];
        } else {
          const like = await pool.query(
            "INSERT INTO likes(user_id, post_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedPostId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return like.rows[0];
        }
      }
    },
    async likeComment(_, { user_id, comment_id }) {
      const sanitizedUserId = sanitize(user_id);
      const sanitizedCommentId = sanitize(comment_id);

      const getCurrentLikes = await pool.query(
        "SELECT user_id FROM commentlikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );
      const getCurrentDislikes = await pool.query(
        "SELECT user_id FROM commentdislikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );

      if (getCurrentLikes) {
        if (
          getCurrentLikes.rows.filter((like) => like.user_id == sanitizedUserId)
            .length > 0
        ) {
          console.log("bruger har allerede liket, fjern like");
          const deleteLike = await pool.query(
            "DELETE FROM commentlikes WHERE comment_id =$1 AND user_id=$2 RETURNING *",
            [sanitizedCommentId, sanitizedUserId]
          );
          return deleteLike.rows[0];
        } else if (
          getCurrentDislikes.rows.filter(
            (commentdislike) => commentdislike.user_id == sanitizedUserId
          ).length > 0
        ) {
          console.log(
            "bruger har disliked, men vælger nu at like og derfor skal dislike fjernes"
          );
          await pool.query(
            "DELETE FROM commentdislikes WHERE comment_id = $1 AND user_id = $2",
            [sanitizedCommentId, sanitizedUserId]
          );
          const like = await pool.query(
            "INSERT INTO commentlikes(user_id, comment_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedCommentId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return like.rows[0];
        } else {
          const like = await pool.query(
            "INSERT INTO commentlikes(user_id, comment_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedCommentId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return like.rows[0];
        }
      }
    },
    async dislikePost(_, { post_id, user_id }) {
      const sanitizedUserId = sanitize(user_id);
      const sanitizedPostId = sanitize(post_id);

      const getCurrentLikes = await pool.query(
        "SELECT user_id FROM likes WHERE post_id = $1",
        [sanitizedPostId]
      );
      const getCurrentDislikes = await pool.query(
        "SELECT user_id FROM dislikes WHERE post_id = $1",
        [sanitizedPostId]
      );

      if (getCurrentDislikes) {
        if (
          getCurrentDislikes.rows.filter(
            (dislike) => dislike.user_id == user_id
          ).length > 0
        ) {
          console.log("bruger har allerede disliket, fjern dislike");
          const deleteDislike = await pool.query(
            "DELETE FROM dislikes WHERE post_id =$1 AND user_id=$2 RETURNING *",
            [sanitizedPostId, sanitizedUserId]
          );
          return deleteDislike.rows[0];
        } else if (
          getCurrentLikes.rows.filter((like) => like.user_id == sanitizedUserId)
            .length > 0
        ) {
          console.log(
            "bruger har liked, men vælger nu at dislike og derfor skal like fjernes"
          );
          await pool.query(
            "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
            [sanitizedPostId, sanitizedUserId]
          );
          const dislike = await pool.query(
            "INSERT INTO dislikes(user_id, post_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedPostId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return dislike.rows[0];
        } else {
          const dislike = await pool.query(
            "INSERT INTO dislikes(user_id, post_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedPostId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return dislike.rows[0];
        }
      }
    },
    async dislikeComment(_, { comment_id, user_id }) {
      const sanitizedUserId = sanitize(user_id);
      const sanitizedCommentId = sanitize(comment_id);

      const getCurrentLikes = await pool.query(
        "SELECT user_id FROM commentlikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );
      const getCurrentDislikes = await pool.query(
        "SELECT user_id FROM commentdislikes WHERE comment_id = $1",
        [sanitizedCommentId]
      );

      if (getCurrentDislikes) {
        if (
          getCurrentDislikes.rows.filter(
            (commentdislike) => commentdislike.user_id == sanitizedUserId
          ).length > 0
        ) {
          console.log("bruger har allerede disliket, fjern dislike");
          const deleteDislike = await pool.query(
            "DELETE FROM commentdislikes WHERE comment_id =$1 AND user_id=$2 RETURNING*",
            [sanitizedCommentId, sanitizedUserId]
          );
          return deleteDislike.rows[0];
        } else if (
          getCurrentLikes.rows.filter(
            (commentlike) => commentlike.user_id == sanitizedUserId
          ).length > 0
        ) {
          console.log(
            "bruger har liked, men vælger nu at dislike og derfor skal like fjernes"
          );
          await pool.query(
            "DELETE FROM commentlikes WHERE comment_id = $1 AND user_id = $2",
            [sanitizedCommentId, sanitizedUserId]
          );
          const dislike = await pool.query(
            "INSERT INTO commentdislikes(user_id, comment_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedCommentId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return dislike.rows[0];
        } else {
          const dislike = await pool.query(
            "INSERT INTO commentdislikes(user_id, comment_id,created_at) VALUES($1,$2,$3) RETURNING *",
            [
              sanitizedUserId,
              sanitizedCommentId,
              new Date().toISOString().slice(0, 19).replace("T", " "),
            ]
          );
          return dislike.rows[0];
        }
      }
    },
  },
};
