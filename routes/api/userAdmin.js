const express = require("express");
const controller = require("../../controllers/api/userAdmin");
const superAdminCheck = require("../../middlewares/superAdminCheck");
const passport = require("passport");
const newAdminValid = require("../../validations/userAdmin/newAdmin");
const deleteAdminValid = require("../../validations/userAdmin/deleteAdmin");

const router = express.Router();

// route  : post api/useradmin/getAllAdmin
// access : private--superAdmin
// why    : to see all admin
router.get(
	"/getAllAdmin",
	passport.authenticate("jwt", { session: false }),
	superAdminCheck,

	controller.getAllAdmin,
);

// route  : post api/useradmin/newAdmin
// access : private--superAdmin
// why    : to see add new admin
router.post(
	"/newAdmin",
	passport.authenticate("jwt", { session: false }),
	newAdminValid.list,
	superAdminCheck,

	controller.postNewAdmin,
);

// route  : delete api/useradmin/deleteAdmin
// access : private--superAdmin
// why    : to delete one admin
router.delete(
	"/deleteAdmin",
	passport.authenticate("jwt", { session: false }),
	deleteAdminValid.list,
	superAdminCheck,
	controller.DeleteAdmin,
);

module.exports = router;
