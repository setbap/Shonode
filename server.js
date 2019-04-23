// imports
const express = require("express");
const mongoose = require("mongoose");
const DBurl = require("./configs/secretAndUrl").DBurl;
const AdminPass = require("./configs/secretAndUrl").pass;
const bodyParser = require("body-parser");
// const apiPost = require("./routes/api/post");
const passport = require("passport");
// const apiProfile = require("./routes/api/profile");
const apiUser = require("./routes/api/user");
const Admin = require("./models/Admin");
const User = require("./models/User");

// setup server
const app = express();
const port = process.env.PORT_ENV || 5000;
app.use((req, res, next) => {
	res.setHeader("access-control-allow-origin", "*");
	res.setHeader("access-control-allow-methods", "GET,PUT,DELETE,PATCH,POST");
	res.setHeader("access-control-allow-headers", "Authorization,Content-type");
	next();
});

//////////////////////////////
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
cloudinary.config({
	cloud_name: "shonode",
	api_key: "938448161173529",
	api_secret: "RzvgdEEa2HReEfHE9l_Lt9Nd-5k"
});
const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "demo",
	allowedFormats: ["jpg", "png", "jpeg"],
	transformation: [{ width: 500, height: 500, crop: "limit" }],
	filename: function(req, file, cb) {
		cb(undefined, Date.now() + file.originalname);
	},
	fileFilter: function(req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
			return callback(new Error("Only images are allowed"));
		}
		callback(null, true);
	}
});
const parser = multer({ storage: storage });

app.post("/api/test", parser.single("image"), (req, res) => {
	console.log("req.file"); // to see what is returned to you
	console.log(req.body.name);

	const image = {};
	image.url = req.file.url;
	image.id = req.file.public_id;
	console.log(image);

	// Image.create(image) // save image information in database
	// 	.then(newImage => res.json(newImage))
	// 	.catch(err => console.log(err));
	res.json(req.file);
});
/////////////////////////////

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// protect route -- active jwt
app.use(passport.initialize());
require("./configs/passportJWT")(passport);

// routes
// app.use("/api/post", apiPost);
// app.use("/api/profile", apiProfile);
app.use("/api/user", apiUser);

// conection part
mongoose
	.connect(DBurl, { useNewUrlParser: true })
	.then(() => {
		console.log("db connected ...");

		Admin.findOne({ email: "ebrsina@gmail.com" }).then(admin => {
			if (!admin) {
				User.findOne({ email: "ebrsina@gmail.com" }).then(user => {
					if (!user) {
						new User({
							name: "sina",
							email: "ebrsina@gmail.com",
							avatar: "aaaaaaaaa",
							password: AdminPass
						})
							.save()
							.then(user => {
								new Admin({
									email: user.email,
									userId: user.id,
									prodsAccess: true,
									orderAccess: true
								})
									.save()
									.then(responce => console.log("created"))
									.catch(err => console.log("user", err));
							})
							.catch(err => console.log("user", err));
					} else {
						new Admin({
							email: user.email,
							userId: user.id,
							prodsAccess: true,
							orderAccess: true
						})
							.save()
							.then(responce => console.log("created"))
							.catch(err => console.log("admin", err));
					}
				});
			}
		});
	})
	.catch(err => {
		console.log(err);
	});

app.listen(port, () => {
	console.log("server up...");
});
