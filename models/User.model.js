const { Schema, model, Types } = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema(

  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
    },

    username: {
      type: String,
      required: [true, 'Username is required.']
    },

    firstname: {
      type: String,
      required: [true, 'First name is required.']
    },

    lastname: {
      type: String,
      required: [true, 'Last name is required.']
    },

    age: {
      type: Number,
      required: [true, 'Age is required.'],
      min: [18, "You can't be less than 18 to register."]
    },

    gender: {
      type: String,
      required: [true, 'Gender is required.'],
      enum: ['MALE', 'FEMALE', 'UNDEFINED']
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'DRIVER'],
      default: 'USER'
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],

    },
    imageUrl: {
      type: String,
    },

    trips: [{
      type: Types.ObjectId,
      ref: 'Trip'
    }],

    friends: [{
      type: Types.ObjectId,
      ref: 'User'
    }],

    cars: [{
      type: Types.ObjectId,
      ref: 'Car'
    }],

    chats: [{
      type: Types.ObjectId,
      ref: 'Chat'
    }]

  },

  {
    timestamps: true
  }

)


userSchema.pre('save', function (next) {

  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(this.password, salt)
  this.password = hashedPassword

  next()
})


userSchema.methods.validatePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password)
}

userSchema.methods.signToken = function () {
  const { _id, email, username, firstname, lastname, age, gender, imageUrl, cars, friends } = this
  const payload = { _id, email, username, firstname, lastname, age, gender, imageUrl, cars, friends }

  const authToken = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: "6h" }
  )

  return authToken
}

const User = model("User", userSchema);

module.exports = User;