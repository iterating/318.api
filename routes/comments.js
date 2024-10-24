const express = require("express");
const router = express.Router();
const comments = require("../data/comments.js")
const posts = require("../data/posts.js")
const users = require("../data/users.js")
const error = require("../utilities/error.js")

router.post('/', (req, res) => {
  const { userId, postId, body } = req.body
  
  if (!userId || !postId || !body) {
    return next(error(400, "Insufficient Data"))
  }

  const comment = {
    id: comments[comments.length - 1].id + 1,
    userId,
    postId,
    body
  }

  comments.push(comment)
  res.json(comment)
})

router.get('/:id', (req, res) => {
  const comment = comments.find(c => c.id == req.params.id)

  if (!comment) {
    return next(error(404, "Comment not found"))
  }

  res.json(comment)
})

router.patch('/:id', (req, res) => {
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      for (const key in req.body) {
        comments[i][key] = req.body[key]
      }
      return true
    }
  })

  if (!comment) {
    return next(error(404, "Comment not found"))
  }

  res.json(comment)
})

router.delete("/:id", (req, res) => {
  const commentIndex = comments.findIndex(c => c.id == req.params.id)

  if (commentIndex === -1){
    return next(error(404, "Comment not found"))
  }

  const deletedComment = comments[commentIndex]
  comments.splice(commentIndex, 1)
  res.json(deletedComment)
})

router.get('/', (req, res) => {
  const { userId, postId } = req.query;

  if (userId) {
    const commentsByUser = comments.filter(c => c.userId == userId);
    return res.json(commentsByUser);
  }

  if (postId) {
    const commentsByPost = comments.filter(c => c.postId == postId);
    return res.json(commentsByPost);
  }

  res.json({ comments });
});

module.exports = router