// middleware/route-guard.js
const Room = require("../models/Room.model");
// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

// const isOwner = (req, res, next) => {
//   Room.findById(req.params.id)
//     .populate("owner")

//     .then((foundRoom) => {
//       if (foundRoom.owner._id === req.session.user._id) {
//         res.render(`/rooms/details/${req.params.id}`);
//         next();
//       } else if (!foundRoom.owner._id) {
//         res.redirect("/");
//       }
//     })
//     .catch((err) => console.log(err));
// };
const isOwner = (req, res, next) => {
  Room.findById(req.params.id)
    .populate("owner")
    .then((foundRoom) => {
      console.log(foundRoom.owner);
      if (
        !req.session.user ||
        foundRoom.owner._id.toString() !== req.session.user._id
      ) {
        res.redirect("/rooms/all-rooms");
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const isNotOwner = (req, res, next) => {
  Room.findById(req.params.id)
    .populate("owner")
    .then((foundRoom) => {
      console.log(foundRoom.owner);
      if (
        !req.session.user ||
        foundRoom.owner._id.toString() === req.session.user._id
      ) {
        res.render("index.hbs", { errorMessage: "You cant review." });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isOwner,
  isNotOwner,
};
