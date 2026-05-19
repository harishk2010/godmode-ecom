const { UserRepository } = require('../repositories');
const { generateToken } = require('../middleware/auth');
const { ApiResponse } = require('../utils/ApiResponse');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await UserRepository.findByEmailWithoutPassword(email);
      if (existingUser) {
        return ApiResponse.error(res, 'Email already registered', 400);
      }

      const user = await UserRepository.create({ name, email, password });
      const token = generateToken(user._id);

      return ApiResponse.success(res, { user, token }, 'Registration successful', 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      if (!user.isActive) {
        return ApiResponse.error(res, 'Account has been deactivated', 401);
      }

      const token = generateToken(user._id);
      const userWithoutPassword = user.toJSON();

      return ApiResponse.success(res, { user: userWithoutPassword, token }, 'Login successful');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async getMe(req, res) {
    try {
      const user = await UserRepository.findById(req.user._id);
      return ApiResponse.success(res, { user });
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, phone, address } = req.body;
      const user = await UserRepository.update(req.user._id, { name, phone, address });
      return ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await UserRepository.findByEmail(req.user.email);

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return ApiResponse.error(res, 'Current password is incorrect', 400);
      }

      user.password = newPassword;
      await user.save();

      return ApiResponse.success(res, {}, 'Password changed successfully');
    } catch (error) {
      return ApiResponse.error(res, error.message, 500);
    }
  }
}

module.exports = new AuthController();
