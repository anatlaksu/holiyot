const mongoose = require("mongoose");

const HoleaRequest = new mongoose.Schema(
  {
    holeaID: { type: String, default: "" }, //מסד

    merhav: { type: String, required: true }, //the id of the merhav that the request belongs to, from a const list from the DB מרחב

    requestedBody: { type: String, required: true }, //the id of the requestedBody that the requested the holea, from a const list from the DB גוף דורש

    requestingUnit: { type: String, required: true }, // יחידה דורשת

    classType: { type: String, required: true }, //סוג כיתה
    classNumRequested: { type: Number, required: true, default: 1 }, //כמות כיתות

    holieaOrigin: { type: String, required: true }, //the id of the holieaOrigin that the request belongs to, from a const list from the DB מקור החוליה

    problemInfo: { type: String, required: true, default: "" }, //מהות התקלה

    classType: { type: String, required: true }, // צ

    toMerhav: { type: String, required: true }, // אל מרחב
    loctionRequested: { type: String, required: true }, // מיקום נדרש

    dateNeeded: { type: Date, required: true }, //תאריך נדרש לחוליה

    alamAproval: { type: Boolean, required: true, default: false }, //תדריך אלם

    pikodAproval: { type: Boolean, required: true, default: false }, //אישור פיקוד

    senderAproval: { type: Boolean, required: true, default: false }, //אישור השולח
    senderAprovalDate: { type: Date, required: true }, //תאריך אישור

    status: { type: Number, required: true, default: 25 }, // סטאטוס פעילות
    /* 
    ? -1 - נדחה
    ? אושר - 50
    ? 75 - בתהליך
    ? 100 - הסתיים
    */

    contactName: { type: String, required: true }, //שם איש קשר
    contactNamePhone: { type: String, required: true }, //טלפון איש קשר

    mesgarotTeneAproval: { type: Boolean, required: true, default: false }, //אישור תחום כשירות ומסגרות טנא

    matcaliTeneAproval: { type: Boolean, required: true, default: false }, //אישור מכלול טנא מטכלי
    matcaliTeneAprovalText: { type: String, required: true }, //טקסט חופשי

    emailList: { type: [String], required: true }, //גורמים לידיעה
  },
  { timestamps: true } //מועד קבלת ההודעה
);

module.exports = mongoose.model("HoleaRequest", HoleaRequest);
