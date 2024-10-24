const express = require("express");
const router = express.Router();
const posts = require("../data/posts.js")
const error = require("../utilities/error.js")
const users = require("../data/users.js")
const comments = require("../data/comments.js")

//////////////POSTS//////////////
// router.get('/', (req, res) => {
//   const links = [
//     {
//       href: "posts/:id",
//       rel: ":id",
//       type: "GET",
//     },
//   ];

//   res.json({ posts, links });
// })

router.get('/:id', (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id)

  const links = [
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "PATCH",
    },
    {
      href: `/${req.params.id}`,
      rel: "",
      type: "DELETE",
    },
  ];
  if (post) res.json({ post, links });
  else next()
})






// Create Post
router.post('/', (req, res) => {
  // Within the POST request route, we create a new
  // post with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (req.body.userId && req.body.title && req.body.content){
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId:  req.body.userId,
      title: req.body.title,
      content: req.body.content
    }

    posts.push(post)
    res.json(post)
  } else {
    next(error(400, "Insufficient Data"))
  }
})

//Update a Post
router.patch('/:id', (req, res) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing post in the database.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      // req.body holds the update for the user
      for (const key in req.body) {
        // applying the req.body keys to the existing user keys, overwriting them
        posts[i][key] = req.body[key]
      }
      return true
    }
  })

  if (post) res.json(post)
  else next()
})

router.delete("/:id", (req, res) => {
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1)
      return true
    }
  })

  if (post) res.json(post);
  else next()
})


// Retrieves all posts by a user with the specified userId /api/posts?userId=userId
router.get('/', (req, res) => {
const userID = req.query.userId
if (userID) {
  const user = users.find(u => u.id == userID)
  res.json(user)
} else {
  res.json({posts}) 
}
})


// Retrieves all comments made on the post with the specified id.
router.get('/:id/comments', (req, res) => {  
  const commentsByPost = comments.filter(c => c.postId == req.params.id)
  res.json(commentsByPost)
})


// Retrieves all comments made on the post with the specified id by a user with the specified userId.
router.get('/:id/comments', (req, res) => {
  const userId = req.query.userId;
  const commentsByUserOnPost = comments.filter(c => c.postId == req.params.id && c.userId == userId);
  res.json(commentsByUserOnPost);
})


// // Search post by query
// router.get('/search/:query', (req, res) => {
//   const query = req.params.query.toLowerCase()
//   const posts = posts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query))
//   res.json({ posts })
// })

module.exports = router