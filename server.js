// imports
const express = require("express");
const mongoose = require("mongoose");
const DBurl = require("./configs/secretAndUrl").DBurl;
const bodyParser = require("body-parser");
// const apiPost = require("./routes/api/post");
const passport = require("passport");
// const apiProfile = require("./routes/api/profile");
const apiUser = require("./routes/api/user");

// setup server
const app = express();
const port = process.env.PORT_ENV || 5000;
app.use((req, res, next) => {
	res.setHeader("access-control-allow-origin", "*");
	res.setHeader("access-control-allow-methods", "GET,PUT,DELETE,PATCH,POST");
	res.setHeader("access-control-allow-headers", "Authorization,Content-type");
	next();
});

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
	})
	.catch((err) => {
		console.log("db err");
	});

app.listen(port, () => {
	console.log("server up...");
});
