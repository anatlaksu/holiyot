const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    // hashed_password: {type: String,required: true},
    // salt: String,
    name: { type: String },
    lastname: { type: String },
    personalnumber: { type: String, trim: true, unique: true, require: true },
    role: { type: String, default: "1" },
    validated: { type: Boolean, default: false },
    unit: { type: String },
    //
    //
    site_permission: { type: String, default: "צפייה ועריכה" },
    //
    // mainscreenid: {type:String},
  },
  { timestamps: true }
);

// virtual field
// userSchema.virtual('password')
// .set(function(password){
//     this._password = password
//     this.salt = uuidv4();
//     this.hashed_password = this.encryptPassword(password)
// })
// .get(function(){
//     return this._password
// })

// userSchema.methods = {
//     authenticate: function(plainText){
//         return this.encryptPassword(plainText) === this.hashed_password;
//     },

//     encryptPassword: function(password){
//         if(!password) return '';
//         try {
//             return crypto.createHmac('sha1', this.salt)
//                             .update(password)
//                             .digest('hex')
//         } catch (err) {
//             return "";
//         }
//     }
// };
module.exports = mongoose.model("User", userSchema);
