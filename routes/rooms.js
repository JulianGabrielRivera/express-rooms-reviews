var express = require("express");
var router = express.Router();
const Room = require("../models/Room.model");
const Review = require("../models/Review.model");
const {
  isLoggedIn,
  isLoggedOut,
  isOwner,
  isNotOwner,
} = require("../middleware/route-guard");
/* GET home page. */
router.get("/all-rooms", async function (req, res, next) {
  try {
    const allRooms = await Room.find().populate("owner");
    console.log(allRooms);

    res.render("rooms/all-rooms.hbs", { allRooms });
  } catch (err) {
    console.log(err);
  }
});
router.get("/create-room", isLoggedIn, function (req, res, next) {
  res.render("rooms/create-room.hbs");
});
router.post("/create-room", isLoggedIn, async function (req, res, next) {
  const { name, description, imageUrl } = req.body;
  try {
    const createdRoom = await Room.create({
      name,
      description,
      imageUrl,
      owner: req.session.user._id,
    });
    console.log(createdRoom);
  } catch (error) {
    console.log(error);
  }
  //   write whole path on redirect, what its mounted on + actual route name.
  res.redirect("/rooms/all-rooms");
});

router.get("/details/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundRoom = await Room.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
        },
      });

    res.render("rooms/room-details.hbs", foundRoom);
  } catch (error) {
    console.log(error);
  }
});
router.get("/edit/:id", isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundRoom = await Room.findById(id);
    res.render("rooms/edit-room.hbs", foundRoom);
  } catch (error) {
    console.log(error);
  }
});
router.post("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imageUrl,
      },
      { new: true }
    );

    res.redirect(`/rooms/details/${id}`);
  } catch (error) {
    console.log(error);
  }
});
router.get("/delete/:id", isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundRoom = await Room.findByIdAndRemove(id);
    console.log("Deleted Room:", foundRoom);
    res.redirect("/rooms/all-rooms");
  } catch (error) {
    console.log(error);
  }
});
router.post("/add-review/:id", isNotOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const createdReview = await Review.create({
      user: req.session.user._id,
      comment: req.body.comment,
    });
    const updatedRoomWithReview = await Room.findByIdAndUpdate(
      id,
      {
        $push: { reviews: createdReview._id },
      },
      { new: true }
    );

    console.log(createdReview);
    console.log(updatedRoomWithReview);
    res.redirect(`/rooms/details/${id}`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
