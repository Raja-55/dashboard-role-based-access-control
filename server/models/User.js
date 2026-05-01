import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      lowercase: true,
      trim: true,
    },
    publicId: { type: String, unique: true, index: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.publicId) {
    // Short, human-friendly id for UI display (not a secret)
    // Example: U-8FK2Q7
    const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
    this.publicId = `U-${rand.slice(0, 6)}`;
  }
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
