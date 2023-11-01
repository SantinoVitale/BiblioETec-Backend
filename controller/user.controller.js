import { userModel } from "../DAO/models/user.model.js";
import { userLogger } from "../utils/log4js.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

class UserController{
  async register(req, res){
    const {firstName, lastName, course, phone, password, email} = req.body;
    if(!firstName || !lastName || !course || !phone || !password || !email)
    {
      userLogger.error("Missing values")
      return res.status(400).json({
        status: "error",
        message: "missing values",
        valid: false
      })
    }

    const existEmail = await userModel.findOne({email: email})
    if(existEmail)
    {
      userLogger.error("The email is already register in a account");
      return res.status(400).json({
        status: "error",
        message: "The email is already register in a account",
        valid: false
      })
    }
    const hashedPassword = await hashPassword(password)
    const newUser = await userModel.create({
      firstName, lastName, course, phone, password: hashedPassword, email
    })
    if(!newUser)
    {
      userLogger.error("Something went wrong");
      return res.status(400).json({
        status: "error",
        message: "something went wrong",
        valid: false
      })
    }

    userLogger.info(`User created with ID: ${newUser._id}`);
    return res.status(200).json({
      status: "success",
      message: "User created",
      payload: newUser,
      valid: true
    })
  }

  async login(req, res){
    const {email, password} = req.body;
    const user = await userModel.findOne({email})
    if(!user)
    {
      userLogger.error(`The user with the email: ${email} don´t exist`)
      return res.status(400).json({
        status: "error",
        message: `The user with the email: ${email} don´t exist`,
        valid: false
      })
    }

    const match = await comparePassword(password, user.password)
    if(!match)
    {
      userLogger.error(`Wrong password, please try again`)
      return res.status(400).json({
        status: "error",
        message: `Wrong password, please try again`,
        valid: false
      })
    }

    userLogger.info(`User with the ID ${user._id} Logged correctly`);
    return res.status(200).json({
      status: "success",
      message: "User Logged",
      valid: true,
      payload: user
    })
  }
}

export const userController = new UserController()