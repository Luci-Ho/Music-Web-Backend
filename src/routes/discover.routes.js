// routes/discover.routes.js
const express = require("express");
const router = express.Router();
const { discover } = require("../controllers/discover.controller.js");

router.get("/", discover);

module.exports = router;