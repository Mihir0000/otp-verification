const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

class UserService {
  async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;
      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: 'Phone and Password required.' });
      }
      const existUser = await User.findOne({ where: { phone } });
      if (existUser) {
        return res.status(400).json({ message: 'User Already Exist' });
      }
      const saltRounds = 10;
      let hashPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
      });
      const userWithoutPassword = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
      };
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async login(req, res, next) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: 'Phone and Password required.' });
      }
      const existUser = await User.findOne({ where: { phone } });
      if (!existUser) {
        return res.status(400).json({ message: 'Invalid Credential' });
      }
      let __isMatch = await bcrypt.compare(password, existUser.password);
      if (!__isMatch) {
        return res.status(400).json({ message: 'Invalid Credential' });
      }

      let cacheVal = myCache.get(`${phone}`);
      if (cacheVal) {
        return res
          .status(200)
          .json({ message: `Please Verify OTP`, otp: cacheVal });
      }
      let val = Math.floor(100000 + Math.random() * 900000);
      myCache.set(`${phone}`, `${val}`, 0);
      return res.status(200).json({ message: `Please Verify OTP`, otp: val });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ message: 'Phone and OTP required.' });
      }
      const existUser = await User.findOne({ where: { phone } });
      if (!existUser) {
        return res.status(400).json({ message: 'Invalid Credential' });
      }
      let cacheVal = myCache.get(`${phone}`);
      console.log(cacheVal);
      if (cacheVal == otp) {
        myCache.del(`${phone}`);
        return res.status(200).json({ message: `OTP Verified` });
      }
      return res.status(400).json({ message: `Invalid OTP` });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
module.exports = new UserService();
