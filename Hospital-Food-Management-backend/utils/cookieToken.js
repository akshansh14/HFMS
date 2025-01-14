const getJwtToken = require("../helpers/getJwtTokens");

const cookieToken = (user, res) => {
	const token = getJwtToken({
		id: user.id,
		role: user.role,
		email: user.email,
	});
	const options = {
		expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	user.password = undefined;

	// Set the cookie without sending a response
	res.cookie("token", token, options);

	return token;
};

module.exports = cookieToken;
