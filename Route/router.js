const express = require("express");
const router = express.Router()
const rtControl = require("./rtControl");

router.get("/",rtControl.Get.Home);

module.exports = router;
