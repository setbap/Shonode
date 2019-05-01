const { check } = require("express-validator/check");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
module.exports.list = [
	[
		check("id")
			.isMongoId()
			.custom((value, { req }) => {
				return Product.findById({ _id: value }).then((prod) => {
					if (!prod) {
						return Promise.reject("wrong product");
					}
				});
			})
			.trim(),
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
