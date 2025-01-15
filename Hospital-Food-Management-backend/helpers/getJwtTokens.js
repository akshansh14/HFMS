const jwt = require("jsonwebtoken");

const getJwtToken = (data) => {
	return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1 day" });
};

module.exports = getJwtToken;