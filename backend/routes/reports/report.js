const express = require("express");
const router = express.Router();
const {
  create,
  find,
  read,
  update,
  remove,
  findbyPikod,
  findbyHoliya,
  findbyHoliyaAprroved,
} = require("../../controllers/reports/report.js");

// find spec
router.put("/report/remove/:id", remove);
router.get("/report/:id", read);
router.post("/report", create);

router.post("/report/update/:id", update);

router.get("/report", find);

router.get("/report/pikod/:id", findbyPikod);

router.get("/report/holi/:id", findbyHoliya);
router.get("/report/holi/approved/:id", findbyHoliyaAprroved);

module.exports = router;
