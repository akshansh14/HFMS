const prisma = require("../prisma/server");
const cookieToken = require("../utils/cookieToken");

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // Define user roles and corresponding Prisma models
    const roles = [
      { role: "ADMIN", model: prisma.admin },
      { role: "INFANTRY", model: prisma.pantryStaff },
      { role: "DELIVERY", model: prisma.deliveryPerson },
    ];

    // Iterate through roles to find the user
    for (const { role, model } of roles) {
      const user = await model.findFirst({
        where: { email, password },
      });

      if (user) {
        cookieToken(user, res);
        return res.status(200).json({ success: true, message: `${role} Log In` });
      }
    }

    // If no user is found
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;


      const admin = await prisma.admin.create({
        data: { email, password },
      });

      cookieToken(user, res);
      
    return res.status(200).json({ success: true, message: "Admincreated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
