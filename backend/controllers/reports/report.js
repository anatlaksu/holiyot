const Report = require("../../models/reports/reports");

exports.find = (req, res) => {
	Report.find((err, report) => {
		if (err) res.send(err);
		res.json(report);
	});
};

exports.findById = (req, res) => {
	Report.findById(req.params.id, (err, report) => {
		if (err) res.send(err);
		res.json(report);
	});
};

exports.findbyunitid = (req, res) => {
	Report.findbyunitid(req.params.id, (err, report) => {
		if (err) res.send(err);
		res.json(report);
	});
};

exports.read = async (req, res) => {
	const report = await Report.findById(req.params.id);
	if (!report) {
		res.status(500).json({ message: 'הטופס לא נמצא' });
	} else {
		res.status(200).send([report]);
	}
};

exports.create = (req, res) => {
	const report = new Report(req.body);
	report.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(data);
	});
};

exports.update = (req, res) => {
	Report.findByIdAndUpdate(req.params.reportId, req.body)
		.then((report) => res.json(report))
		.catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
	Report.deleteOne({ _id: req.params.id })
		.then((report) => res.json(report))
		.catch((err) => res.status(400).json("Error: " + err));
};

//
