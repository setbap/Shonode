const { check } = require("express-validator/check");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
module.exports.list = [
	[
		check("page")
			.optional()
			.isNumeric(),
		check("category")
			.optional()
			.isMongoId()
			.custom((value, { req }) => {
				return Category.findById({ _id: value }).then((cat) => {
					if (!cat) {
						return Promise.reject("wrong category");
					}
				});
			})
			.trim(),
		check("brand")
			.optional()
			.isMongoId()
			.custom((value, { req }) => {
				return Brand.findById({ _id: value }).then((brand) => {
					if (!brand) {
						return Promise.reject("wrong brand");
					}
				});
			})
			.trim(),
	],
];
