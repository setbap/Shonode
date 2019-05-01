const { check } = require("express-validator/check");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
module.exports.list = [
	[
		check("title")
			.isString()
			.isLength({ min: 2, max: 64 })
			.trim(),
		check("price")
			.isCurrency()
			.isLength({ max: 10 })
			.trim(),
		check("size")
			.isString()
			.isLength({ min: 2, max: 64 })
			.trim()
			.optional(),
		check("count")
			.isNumeric()
			.trim()
			.optional(),
		check("color")
			.isString()
			.isLength({ min: 2, max: 64 })
			.trim()
			.optional(),
		check("material")
			.isString()
			.isLength({ min: 2, max: 64 })
			.trim()
			.optional(),
		check("category")
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
			.isMongoId()
			.custom((value, { req }) => {
				return Brand.findById({ _id: value }).then((brand) => {
					if (!brand) {
						return Promise.reject("wrong brand");
					}
				});
			})
			.trim(),
		check("offPrice")
			.optional()
			.isCurrency()
			.isLength({ max: 10 })
			.trim(),
		check("description")
			.isString()
			.isLength({ min: 16 })
			.trim(),
		check("imageUrl")
			.isString()
			.isLength({ min: 16 })
			.trim(),

		check("spec")
			.isArray()
			.trim(),
		// check("comments")
		// 	.isArray()
		// 	.trim(),
	],
];
