const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, default: 'IVAN'},
  date: { type: Date, default: Date.now },
  dateLogin: { type: Date, default: Date.now },
  status: {type: Boolean, default: true}
})

module.exports = model('User', schema)