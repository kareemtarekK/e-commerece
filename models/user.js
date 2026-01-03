const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter your name"],
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "enter your email"],
    },
    passwordHash: {
      type: String,
      required: [true, "enter your password"],
    },
    street: String,
    apartment: String,
    city: String,
    zip: Number,
    country: String,
    phone: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.comparePassword = async function (
  password,
  databasePassword
) {
  return await bcrypt.compare(password, databasePassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
