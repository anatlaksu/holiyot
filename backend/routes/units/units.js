const express = require("express");
const {
	find,
	findByUnit,
	UnitLength,
	getbyunit,
} = require("../../controllers/units/units");
const router = express.Router();

router.get("/units/length", UnitLength);
router.get("/units", find);
router.get("/units/:id", findByUnit);

module.exports = router;
