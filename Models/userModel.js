const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      minLength: 3,
      maxLength: 30,
    },

    email: {
      type: String,
      required: [true, "Please enter a email address"],
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user", "modaretor"],
      default: "user",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
