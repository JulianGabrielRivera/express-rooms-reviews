var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/all-rooms", function (req, res, next) {
  res.render("rooms/all-rooms.hbs");
});
router.get("/create-room", function (req, res, next) {
  res.render("rooms/create-room.hbs");
});
// router.post("/create-room", function (req, res, next) {
// });

module.exports = router;
