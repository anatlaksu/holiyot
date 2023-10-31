const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const CronJob = require("cron").CronJob;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//app config
const app = express();

//middlware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Configure Mongo
const db = "mongodb://127.0.0.1/holiyot";

// Connect to Mongo with Mongoose
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("Mongo connected"))
	.catch((err) => console.log(err));

const mongo = mongoose.connection;

const updateCollections = async () => {
	const collection = mongo.collection("reservevisits");
	await collection.updateMany({}, { $set: { todayPresent: false } });
};

new CronJob(
	"0 0 * * *",
	async () => {
		await updateCollections();
	},
	null,
	true,
	"Asia/Jerusalem"
);

//user routes
const authRoutes = require("./routes/authentication/auth");
const userRoutes = require("./routes/authentication/user");
app.use("/api", authRoutes);
app.use("/api", userRoutes);
//units routes
const gdodRoutes = require("./routes/units/gdod");
const hativaRoutes = require("./routes/units/hativa");
const ogdaRoutes = require("./routes/units/ogda");
const pikodRoutes = require("./routes/units/pikod");
const unitsRoutes = require("./routes/units/units");
app.use("/api", unitsRoutes);
app.use("/api", gdodRoutes);
app.use("/api", hativaRoutes);
app.use("/api", ogdaRoutes);
app.use("/api", pikodRoutes);

//general routes
const reportRoutes = require("./routes/reports/report");
app.use("/api", reportRoutes);


if (process.env.NODE_ENV === "production") {
	//set static folder
	app.use(express.static("frontend/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
}

//listen
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
