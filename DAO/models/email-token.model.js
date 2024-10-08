import { Schema, model } from "mongoose";

export const emailTokenModel = model("email-tokens", new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600 // 1 Hour
  },
  expiry:{
    type: Date,
    required: true
  }
})
);