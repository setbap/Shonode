const preUser = require("../../models/preUser");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtSecret = require("../../configs/secretAndUrl").jwtSecret;
const nodemailer = require("nodemailer");
const gravatar = require("gravatar");
const myMail = require("../../configs/myMail");

const { validationResult } = require("express-validator/check");

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: myMail.user,
		pass: myMail.pass,
	},
});

exports.current = (req, res, next) => {
	res.json({ ...req.user, done: true });
};

exports.postRegister = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const { email, password, name } = req.body;
	try {
		const user = await preUser.findOne({ email });
		const puser = await User.findOne({ email });

		if (user || puser) {
			return res.status(401).json({ err: "emial already exist." });
		}
		const salt = await bcrypt.genSalt(10);
		var avatar = gravatar.url(
			email,
			{ s: "100", r: "x", d: "retro" },
			false,
		);
		const hashedPass = await bcrypt.hash(password, salt);
		const newUser = new preUser({
			email,
			password: hashedPass,
			avatar,
			name,
		});
		const resualt = await newUser.save();
		const mailOptions = {
			from: myMail.pass, // sender address
			to: email, // list of receivers
			subject: "verify your emial", // Subject line
			html: `
					<p>some one reuested to create account in our website with your email </p>
					<p> your id is :${resualt._id}</p>
					<p> please insert your id to validate emial</p>
					<p> if you out of page go to /register/validate page to insert id</p>
				  `,
		};

		transporter.sendMail(mailOptions, function(err, info) {
			if (err) console.log(err);
			// else console.log(info);
		});
		return res.json(resualt);
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: "err in local server" });
	}
};

exports.postValidate = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const id = req.body.userId;

	try {
		const pu = await preUser.findById(id);
		if (pu) {
			const enduser = new User({
				name: pu.name,
				email: pu.email,
				password: pu.password,
				avatar: pu.avatar,
			});
			const newuser = await enduser.save();
			await pu.remove();

			res.json({ succ: "email verified" });
		} else {
			res.status(404).json({
				err: "no user with this email is registered",
			});
		}
	} catch (error) {
		res.status(500).json({ err: "server err" });
	}
};

exports.postLogin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ err: "emial or password is incorrect" });
		}
		const pass = await bcrypt.compare(password, user.password);
		if (!pass) {
			return res
				.status(401)
				.json({ err: "emial or password is incorrect" });
		}
		const jwtpayload = {
			name: user.name,
			email: user.email,
			id: user._id,
			avatar: user.avatar,
		};
		jwt.sign(jwtpayload, jwtSecret, { expiresIn: "1h" }, (err, encoded) => {
			if (err) {
				throw new Error("err in jwt");
			}
			res.status(201).json({
				done: true,
				secret: "bearer " + encoded,
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("err in creating");
	}
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.status(404).json({ err: "err not found" });
		}
		const token = buffer.toString("hex");
		const email = req.body.email;
		console.log(email);

		User.findOne({ email })
			.then((usr) => {
				if (usr) {
					usr.resetTime = Date.now() + 3600000;
					usr.resetCode = token;
					usr.save().then((resu) => {
						const mailOptions = {
							from: myMail.pass, // sender address
							to: email, // list of receivers
							subject: "Subject of your email", // Subject line
							html: `
									<p>You requested a password reset</p>
									<p>this is your token ${token} </p>
									<p>insert your token and new emial to change your pass</p>
									<p>if you forget url go to forget password page</p>
									<p>this code is valid for 1hour </p>
          						`,
						};

						transporter.sendMail(mailOptions, function(err, info) {
							if (err) console.log(err);
							else console.log(info);
						});

						res.json({ succ: "email sended to your email" });
					});
				} else {
					res.status(404).json({
						err: "there is no user with this email",
					});
				}
			})
			.catch((err) => {
				res.status(404).json({
					err: "internal err",
				});
			});
	});
};

exports.postNewPass = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const email = req.body.email;
	const password = req.body.password;
	const resetCode = req.body.token;
	console.log(password);
	console.log(resetCode);
	console.log(email);

	User.findOne({
		email,
		resetCode,
		resetTime: { $gt: Date.now() },
	})
		.then((usr) => {
			if (usr) {
				bcrypt.hash(password, 12, (err, hash) => {
					if (err) {
						return res.redirect("404");
					}
					usr.password = hash;
					usr.resetCode = null;
					usr.resetTime = null;
					usr.save().then(() => {
						res.json({ succ: "password changed" });
					});
				});
			} else {
				res.status(404).json({
					err:
						"no user was found or your time ended . please try again",
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				err: "internal err",
			});
		});
};
