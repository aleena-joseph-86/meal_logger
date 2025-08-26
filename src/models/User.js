const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const UserSchema = new mongoose.Schema({
  userId: { type: String, default: () => uuidv4(), index: true, unique: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, required: true, enum: ['male','female'] },
  height: { type: Number, required: true }, // cm
  weight: { type: Number, required: true }  // kg
}, { timestamps: true });

UserSchema.methods.calculateBMR = function() {
  const gender = this.gender;
  const weight = this.weight;
  const heightCm = this.height;
  const age = this.age;
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weight + 4.799 * heightCm - 5.677 * age;
  } else { 
    bmr = 447.593 + 9.247 * weight + 3.098 * heightCm - 4.33 * age;
  }
  return Math.round(bmr * 100) / 100;
}

module.exports = mongoose.model('User', UserSchema);