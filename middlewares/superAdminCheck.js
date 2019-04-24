const adminEmail = require("../configs/secretAndUrl").adminEmail;

module.exports = (req, res, next) => {
	if (req.user.email == adminEmail) {
		return next();
	}
	return res.status(401).json({
		err: "cant access to this url",
	});
};
