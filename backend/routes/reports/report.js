const express = require("express");
const router = express.Router();
const {
  create,
  find,
  read,
  update,
  remove,
} = require("../../controllers/reports/report.js");

// find spec
router.put("/report/remove/:id", remove);
router.get("/report/:id", read);
router.post("/report", create);

router.post("/report/update/:id", update);

router.get("/report", find);

module.exports = router;
