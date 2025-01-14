const prisma = require("../prisma/server");
const cookieToken = require("../utils/cookieToken");

// User login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "Please enter all fields" });
		}

		// Define user roles and corresponding Prisma models
		const roles = [
			{ role: "ADMIN", model: prisma.admin },
			{ role: "INFANTRY", model: prisma.pantryStaff },
			{ role: "DELIVERY", model: prisma.deliveryPerson },
		];

		let userFound = null;
		let userRole = null;

		// Iterate through roles to find the user
		for (const { role, model } of roles) {
			const user = await model.findFirst({
				where: { email, password },
			});

			if (user) {
				userFound = user;
				userRole = role;
				break; // Exit loop once the user is found
			}
		}

		let token;

		if (userFound) {
			// Set the cookie and send response
			token = cookieToken(userFound, res);
			userFound.token = token;
			return res.status(200).json({
				success: true,
				message: `${userRole} Log In`,
				user: userFound,
			});
		}

		// If no user is found
		return res
			.status(401)
			.json({ success: false, message: "Invalid email or password" });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
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
