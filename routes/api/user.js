const express = require("express");
const controller = require("../../controllers/api/user");
const passport = require("passport");
const registerValid = require("../../validations/register");
const loginValid = require("../../validations/login");
const emialregValid = require("../../validations/emialRegister");
const resetPassValid = require("../../validations/resetPass");
const verifyResetValid = require("../../validations/verifyReset");

const router = express.Router();

// route  : post api/user/current
// access : private
// why    : to see user info
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	controller.current,
);

// route  : post api/user/register
// access : public
// why    : to signUp users
router.post("/register", registerValid.list, controller.postRegister);

// route  : post api/user/register/validate
// access : public
// why    : to validate user email
router.post("/register/validate", emialregValid.list, controller.postValidate);

// route  : post api/user/login
// access : public
// why    : to login users
router.post("/login", loginValid.list, controller.postLogin);

// route  : post api/user/register/reset-password
// access : public
// why    : to reset password with emial
router.post(
	"/register/reset-password",
	resetPassValid.list,
	controller.postReset,
);

// route  : post api/user/register/reset-password
// access : public
// why    : to reset password with emial
router.post(
	"/register/reset-password/new-password",
	verifyResetValid.list,
	controller.postNewPass,
);

module.exports = router;
