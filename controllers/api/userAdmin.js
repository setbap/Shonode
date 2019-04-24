const User = require("../../models/User");
const superAdmin = require("../../configs/secretAndUrl").adminEmail;
const Admin = require("../../models/Admin");
const { validationResult } = require("express-validator/check");

exports.postNewAdmin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const { email, orderAccess, prodsAccess } = req.body;

	try {
		const admin = await Admin.findOne({ email });
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ err: "no user with this email found" });
		} else if (admin) {
			return res
				.status(400)
				.json({ err: "there is admin with this email " });
		}

		const newAdmin = new Admin({
			email,
			orderAccess,
			prodsAccess,
			userId: user._id,
		});
		const resualt = await newAdmin.save();
		return res.json(resualt);
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "err in local server" });
	}
};

exports.getAllAdmin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	try {
		const admins = await Admin.find({});
		return res.json({ admins: admins });
	} catch (error) {
		res.status(500).json({ err: "server err" });
	}
};

exports.DeleteAdmin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	if (req.body.email == superAdmin) {
		return res.status(401).json({ err: "you cant delete that" });
	}

	try {
		const deletedAdmin = await Admin.findOneAndDelete({
			email: req.body.email,
		});
		if (deletedAdmin) {
			return res.json({ admins: admins, succ: "done" });
		}
		return res.status(404).json({ err: "admin with this email not found" });
	} catch (error) {
		return res.status(500).json({ err: "server err" });
	}
};
