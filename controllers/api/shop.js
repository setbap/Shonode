const Order = require("../../models/Order");
const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Product = require("../../models/Product");
const { validationResult } = require("express-validator");

exports.postBrand = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const { imageUrl, name, desc } = req.body;

	Brand.findOne({ name })
		.then(brand => {
			if (brand) {
				// there is one brand with this name =>err
				res.status(400).json({
					err: "this brand exist"
				});
			} else {
				// new brand so save it
				new Brand({
					name,
					imageUrl,
					desc
				})
					.save()
					.then(profile => res.json(profile));
			}
		})
		.catch(err => {
			res.status(500).json({
				err: "internal err"
			});
		});
};

exports.postCategory = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const { imageUrl, gender, name } = req.body;

	Category.findOne({ name })
		.then(category => {
			if (category) {
				// there is one category with this name =>err
				res.status(400).json({
					err: "this category exist"
				});
			} else {
				// new category so save it
				new Category({
					name,
					imageUrl,
					gender
				})
					.save()
					.then(category => res.json(category));
			}
		})
		.catch(err => {
			res.status(500).json({
				err: "internal err"
			});
		});
};
