import User from '../models/User.js';

export const getAuthorities = async (req, res) => {
  try {
    const authorities = await User.find({
      role: { $in: ['authority', 'admin'] },
      isActive: true
    }).select('name email phone profile role').limit(20);

    res.status(200).json({
      success: true,
      data: { authorities }
    });
  } catch (error) {
    console.error('Get authorities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching authorities'
    });
  }
};