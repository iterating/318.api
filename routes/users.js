const express = require("express");
const router = express.Router();
const error = require("../utilities/error.js")
const users = require("../data/users.js")

// BASE PATH FOR THIS ROUTER IS: /api/users

//////////////USERS//////////////
// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
router.get('/', (req, res) => {
  const links = [
    {
      href: "users/:id",
      rel: ":id",
      type: "GET",
    },
  ];

  res.json({ users, links });
})

// Creating a simple GET route for individual users,
// using a route parameter for the unique id.
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id)
  console.log(user)
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

  if (user) res.json({ user, links });
  else next();
})

//Search user by name
router.get('/name/:name', (req, res) => {
  const user = users.find(u => u.name == req.params.name);
  if (!user) {
    return next();
  }
  res.json(user);
});

//Search user by boolean query
router.get('/search/:query', (req, res) => {
  const query = req.params.query;
  const user = users.find(u => u.name.includes(query) || u.username.includes(query) || u.email.includes(query));
  if (!user) {
    return next();
  }
  res.json(user);
});


// Create User
router.post('/', (req, res) => {
  // Within the POST request route, we create a new
  // user with the data given by the client.
  // We should also do some more robust validation here,
  // but this is just an example for now.
  if (!isNaN(req.body.name.charAt(0))) {
    return next(error(400, 'Name cannot start with a number'))
  }
  if (req.body.name && req.body.username && req.body.email){
    const foundUser = users.find(u => u.username === req.body.username)
    if (foundUser) {
      return next(error(400, 'Username Already Taken'))
    }

    const user = {
      id: users[users.length - 1].id + 1,
      name:  req.body.name,
      username: req.body.username,
      email: req.body.email
    }

    users.push(user)
    res.json(user)
  } else {
    next(error(400, 'Insufficient Data'))
  }
})

router.patch('/:id', (req, res) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      // req.body holds the update for the user
      for (const key in req.body) {
        // applying the req.body keys to the existing user keys, overwriting them
        users[i][key] = req.body[key]
      }
      return true
    }
  })

  if (user) res.json(user)
  else next()
})

router.delete("/:id", (req, res) => {
  // const user = user.find((u, i) => {
  //   if (u.id == req.params.id) {
  //     users.splice(i, 1)
  //      return true
  //   }
  // })

  const userIndex = users.findIndex(u => u.id == req.params.id)

  if (userIndex !== -1){
    const deletedUser = users[userIndex]
    users.splice(userIndex, 1)
    res.json(deletedUser)
  } else {
    next()
  }

})



module.exports = router