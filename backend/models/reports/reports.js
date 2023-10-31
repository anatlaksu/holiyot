const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reportSchema = new mongoose.Schema({
	namecontact: { type: String, require: true },
	numbercontact: { type: Number, require: true },
    msd: { type: String, require: true},
	merhav: { type: String, require: true},
	body_requires: { type: String, require: true },
	unit_requires: { type: String, require: true},
	class: { type: String, require: true},
	number_class: { type: Number, require: true},
	source_holi: { type: String, require: true},
	what_happend: { type: String, require: true },
	zadik: { type: String, require: true },
	to_merhav: { type: String, require: true },
	mikom: { type: String, require: true },
	date_need: { type: Date, require: true },
    mail:{ type: Array },
    alm:{ type: String},
    pikod:{ type: String},
    table:{ type: String},
    date_approv:{ type: String},
    status:{type: Number},
    kshirot_tne:{type: String},
    matcal_tne:{type: String},
    pirot:{type: String},
},
{ timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
