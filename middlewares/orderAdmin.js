const adminEmail = require("../configs/secretAndUrl").adminEmail;
const Admin = require("../models/Admin");
module.exports = (req, res, next) => {
	Admin.findOne({ email: req.user.email, orderAccess: 1 })
		.then((admin) => {
			if (admin) {
				return next();
			}
			return res.status(401).json({
				err: "cant access to this url",
			});
		})
		.catch((err) => {
			return res.status(500).json({
				err: "server err ",
			});
		});
};
