const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reportSchema = new mongoose.Schema({
	namecontact: { type: String, require: true },
	numbercontact: { type: String, require: true },
    msd: { type: String, require: true},
	body_requires: { type: String, require: true },
	unit_requires: { type: String, require: true},
	class: { type: String, require: true},
	number_class: { type: Number, require: true, default:1},
	source_holi: { type: String, require: true},
	what_happend: { type: String, require: true },
	type_happend: { type: String, require: true, default:"לא משבית" },
	amlah: { type: String, require: true },
	zadik: { type: String },
	merhav_amlah:{ type: String, require: true },
	mikom: { type: String, require: true },
	date_need: { type: Date, require: true },
    mail:{ type: Array , require: true},
    alm:{ type: Boolean},
    pikod:{ type: Boolean},
    road:{ type: Boolean},
    date_approv:{ type: String},
    status:{type: Number},
    kshirot_tne:{type: Boolean},
	pirot_kshirot_tne:{type: String},
	date_kshirot_tne:{type:Date},
    matcal_tne:{type: Boolean},
    pirot_matcal_tne:{type: String},
	date_matcal_tne:{type:Date},
},
{ timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
