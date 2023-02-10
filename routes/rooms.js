var express = require("express");
var router = express.Router();
const Room = require("../models/Room.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
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
    const foundRoom = await Room.findById(id).populate("owner");
    res.render("rooms/room-details.hbs", foundRoom);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
