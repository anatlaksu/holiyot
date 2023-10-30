const Unit = require("../../models/units/units");

exports.find = (req, res) => {
	Unit.find()
		.sort({ index: 1 })
		.then((units) => res.json(units))
		.catch((err) => res.status(400).json("Error: " + err));
};

exports.findByUnit = (req, res) => {
	Unit.find({ _id: req.params.id })
		.then((units) => res.json(units))
		.catch((err) => res.status(400).json("Error: " + err));
};
//! expremental
exports.UnitLength = (req, res) => {
	Unit.countDocuments({})
		.then((count) => res.json(count))
		.catch((err) => res.status(400).json("Error: " + err));
};
//!
