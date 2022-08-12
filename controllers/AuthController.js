const { User } = require('../models')
const middleware = require('../middleware')

//----------------------------------------------------------//
//--Check Login payload, Use Register in routes/UserRouter--//
//----------------------------------------------------------//

const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      raw: true
    })

    if (
      user &&
      (await middleware.comparePassword(user.passwordDigest, req.body.password))
    ) {
      let payload = {
        id: user.id,
        username: user.username
      }

      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized - Login Issue' })
  } catch (error) {
    throw error
  }
}

const Register = async (req, res) => {
  try {
    const { username, email, password, city, isHunter } = req.body
    let passwordDigest = await middleware.hashPassword(password)
    const user = await User.create({
      username,
      email,
      passwordDigest,
      city,
      isHunter
    })
    res.send(user)
  } catch (error) {
    throw error
  }
}

const UpdatePassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (
      user &&
      (await middleware.comparePassword(
        user.dataValues.passwordDigest,
        req.body.oldPassword
      ))
    ) {
      let passwordDigest = await middleware.hashPassword(req.body.newPassword)

      await user.update({ passwordDigest })
      return res.send({ status: 'Success', msg: 'Password Updated' })
    }
    res.status(401).send({ status: 'Error', msg: 'Invalid Credentials' })
  } catch (error) {
    throw error
  }
}

module.exports = {
  Login,
  Register,
  UpdatePassword
}
