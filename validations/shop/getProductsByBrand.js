const { check } = require("express-validator/check");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
module.exports.list = [
	[
		check("brandId")
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
