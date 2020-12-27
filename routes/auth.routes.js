const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config =require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
  '/register',
  [
    check('email', 'Invalid E-mail').isEmail(),
    check('password', 'Invalid password, min length 1').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Data'
      })
    }
    const {email, password} = req.body

    const candidate = await User.findOne({email})

    if (candidate) {
      return res.status(400).json({message:'This user already exist'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({email, password: hashedPassword })

    await user.save()
    res.status(201).json({message: 'User created'})
  } catch (e) {
    res.status(500).json({message: 'Internal Server Error'})
  }
})


router.post('/login',
  [
    check('email', 'Invalid E-mail').normalizeEmail().isEmail(),
    check('password', 'Invalid password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Data'
      })
    }

    const {email, password, dateLogin} = req.body
    const user = await User.findOne({email})
    await User.findOneAndUpdate({email}, {$set: {dateLogin: dateLogin}})

    if(!user) {
      return res.status(400).json({message: 'User not found'})
    }

    if(!user.status) {
      return res.status(400).json({message: 'User has been BLOCKED'})
    }

    const isMath = await bcrypt.compare(password, user.password)
    if (!isMath) {
      return res.status(400).json({message: 'Incorrect password'})
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      {expiresIn: '1h'}
      )

    res.json({token, userId: user.id })

  } catch (e) {
    res.status(500).json({message: 'Internal Server Error'})
  }

})

module.exports = router