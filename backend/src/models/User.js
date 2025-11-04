// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true, 
//     trim: true 
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     lowercase: true, 
//     trim: true 
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   // ✅ Make sure this exists
//   emailNotifications: {
//     enabled: { 
//       type: Boolean, 
//       default: true 
//     },
//     frequency: { 
//       type: String, 
//       enum: ['instant', 'daily', 'disabled'],
//       default: 'instant' 
//     },
//     types: {
//       type: [String],
//       default: ['follow-up', 'interview-prep', 'deadline', 'thank-you', 'custom']
//     }
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// module.exports = mongoose.models.User || mongoose.model('User', userSchema);

















const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // NEW: Email notification preferences
  emailNotifications: {
    enabled: {
      type: Boolean,
      default: true  // Enable by default
    },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'instant'  // Send emails immediately
    },
    types: {
      type: [String],
      default: ['follow-up', 'interview-prep', 'deadline', 'thank-you', 'custom']  // All types enabled
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);