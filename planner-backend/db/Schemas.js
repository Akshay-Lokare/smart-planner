const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // ---- SESSION DATA ----
    session: {
      hash: {
        type: String, // SHA-256 hash of session key
        default: null
      },
      expiresAt: {
        type: Date,
        default: null
      },
      lastLoginAt: {
        type: Date,
        default: null
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", AuthSchema);
