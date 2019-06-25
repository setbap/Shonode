const Order = require("../../models/Order");
const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const User = require("../../models/User");
const Product = require("../../models/Product");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator/check");

/////////////// cat&bradn part   /////////////

exports.GetBrandLimit = (req, res, next) => {
	var perPage = 7;

	Brand.find({})
		.limit(perPage)
		.then((brand) => {
			res.json({
				brand: brand,
			});
		});
};

exports.GetCatLimit = (req, res, next) => {
	var perPage = 4;

	Category.find({})
		.limit(perPage)
		.then((cat) => {
			res.json({
				cat: cat,
			});
		});
};

exports.postBrand = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log({ errors: errors.array() });

		return res.status(422).json({ errors: errors.array() });
	}
	const { imageUrl, name, desc } = req.body;

	Brand.findOne({ name })
		.then((brand) => {
			if (brand) {
				// there is one brand with this name =>err
				res.status(400).json({
					err: "this brand exist",
				});
			} else {
				// new brand so save it
				new Brand({
					name,
					imageUrl,
					desc,
				})
					.save()
					.then((profile) => res.json(profile));
			}
		})
		.catch((err) => {
			res.status(500).json({
				err: "internal err",
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
		.then((category) => {
			if (category) {
				// there is one category with this name =>err
				res.status(400).json({
					err: "this category exist",
				});
			} else {
				// new category so save it
				new Category({
					name,
					imageUrl,
					gender,
				})
					.save()
					.then((category) => res.json(category));
			}
		})
		.catch((err) => {
			res.status(500).json({
				err: "internal err",
			});
		});
};

exports.getBrands = (req, res, next) => {
	Brand.find({}).then((brands) => {
		res.json({ brands });
	});
};

exports.getCategories = (req, res, next) => {
	Category.find({}).then((cat) => {
		res.json({ cat });
	});
};

exports.postFindCategoriesByGender = (req, res, next) => {
	const gender = req.body.gender;
	Category.find({ gender: gender }).then((cat) => {
		res.json({ cat });
	});
};

exports.postFindCategories = (req, res, next) => {
	const cat = req.body.categorySearch;
	// var regex = new RegExp(["^", cat, "$"].join(""), "i");
	Category.find({ name: new RegExp(cat, "gi") }).then((cat) => {
		res.json({ cat });
	});
};

exports.postFindBrands = (req, res, next) => {
	const brand = req.body.brandSearch;
	// var regex = new RegExp("^" + req.body.brandSearch.toLowerCase(), "i");

	Brand.find({ name: new RegExp(brand, "gi") }).then((brands) => {
		res.json({ brands });
	});
};

/////////////// end  cat&bradn part   /////////////

///////////  add edit get search  product ///////////////

exports.postAddProduct = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const {
		title,
		price,
		size,
		color,
		count,
		material,
		category,
		brand,
		offPrice,
		imageUrl,
		description,
		spec,
	} = req.body;

	// set all info in one object
	const prodField = {};

	// if (_id) prodField._id = id;
	if (title) prodField.title = title;
	if (price) prodField.price = price;
	if (size) prodField.size = size;
	if (color) prodField.color = color;
	if (count) prodField.count = count;
	if (material) prodField.material = material;
	if (category) prodField.category = category;
	if (brand) prodField.brand = brand;
	if (offPrice) prodField.offPrice = offPrice;
	if (imageUrl) prodField.imageUrl = imageUrl;
	if (description) prodField.description = description;
	if (spec) prodField.spec = spec;

	const creator = req.user.id;
	Product.findOne({ _id: req.body.id })
		.then((p) => {
			if (p) {
				// update prod
				Product.findOneAndUpdate(
					{ _id: req.body.id },
					{ $set: prodField },
					{ new: true },
				)
					.then((prod) => res.json(prod))
					.catch((err) => {
						return res.status(500).json({
							err: "err in save and update",
						});
					});
			} else {
				// create new prod
				const newProduct = new Product({
					title,
					price,
					size,
					color,
					count,
					material,
					category,
					brand,
					offPrice,
					imageUrl,
					creator,
					description,
					spec,
				})
					.save()
					.then((prod) => {
						console.log("prod added");

						return res.json(prod);
					})
					.catch((err) => {
						console.log(err);

						return res.status(500).json({
							err: "err in save ",
						});
					});
			}
		})
		.catch((err) => {
			console.log(err);

			return res.status(500).json({
				err: "err in save and update",
			});
		});
};

exports.postGetProducts = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var perPage = 12;
	var page = req.body.page || 1;
	const filter = {};
	if (req.body.category) filter.category = req.body.category;
	if (req.body.brand) filter.brand = req.body.brand;

	Product.find(filter)
		.skip(perPage * page - perPage)
		.limit(perPage)
		.then((products) => {
			Product.find(filter)
				.countDocuments()
				.exec(function(err, count) {
					if (err) return next(err);
					res.json({
						products,
						current: page,
						pages: Math.ceil(count / perPage),
						count: count,
						itemPerPage: 12,
					});
				});
		});
};

exports.postGetSingleProduct = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const filter = {};
	filter._id = req.body.id;
	if (req.body.category) filter.category = req.body.category;
	if (req.body.brand) filter.brand = req.body.brand;
	console.log(filter);

	Product.findOne(filter)
		.populate("category")
		.populate("brand")
		.populate("comments.userId", "name")

		.then((product) => {
			if (product) {
				return res.json(product);
			}
			return res.status(404).json({
				err: "product not found",
			});
		})
		.catch((err) => {
			return res.status(500).json({
				err: "internal err ",
			});
		});
};

exports.postFindProducts = (req, res, next) => {
	const word = req.body.word;
	// var regex = new RegExp(["^", cat, "$"].join(""), "i");
	Product.find({
		$text: { $search: word },
	})
		.then((prods) => {
			return res.json(prods);
		})
		.catch((err) => {
			return res.status(500).json({
				err: "internal err",
			});
		});
};

exports.postFindProductsByCategory = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const word = req.body.catId;
	// var regex = new RegExp(["^", cat, "$"].join(""), "i");
	Category.findOne({ _id: word })
		.then((cat) => {
			Product.find({ category: word })
				.select("title brand category id price imageUrl")
				.populate("category", "name")
				.populate("brand", "name")
				.then((prods) => {
					return res.json({ prods, cat: cat });
				})
				.catch((err) => {
					return res.status(500).json({
						err: "internal err",
					});
				});
		})
		.catch((err) => {
			return res.status(500).json({
				err: "internal err",
			});
		});
};

exports.postFindProductsByBrand = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const word = req.body.brandId;
	Brand.findOne({ _id: word })
		.then((brand) => {
			Product.find({ brand: word })
				.select("title brand category id price imageUrl")
				.populate("category", "name")
				.populate("brand", "name")
				.then((prods) => {
					return res.json({ prods: prods, brand: brand });
				})
				.catch((err) => {
					return res.status(500).json({
						err: "internal err",
					});
				});
		})
		.catch((err) => {
			return res.status(500).json({
				err: "internal err",
			});
		});
};

exports.postComment = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	const title = req.body.title;
	const content = req.body.content;
	const userId = req.user.id;
	try {
		const prod = await Product.findById(prodId);
		await prod.addComment(title, content, userId);
		return res.json({
			done: "done",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			err: "internal err",
		});
	}
};

exports.postiWant = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	const userId = req.user.id;

	Product.findById(prodId)
		.then((prod) => {
			if (!prod) {
				return res.status(404).json({ error: "404 not found" });
			}
			const index = prod.iWant
				.map((wnats) => wnats.userId.toString())
				.indexOf(userId);
			if (index !== -1) {
				//unlike
				User.findOne({ _id: userId }).then((person) => {
					person
						.postIwant(prodId)
						.then((res) => console.log("added"))
						.catch((err) => console.log("not added"));
				});

				prod.iWant.splice(index, 1);
			} else {
				User.findOne({ _id: userId }).then((person) => {
					console.log(person);

					person
						.postIwant(prodId)
						.then((res) => console.log("added"))
						.catch((err) => console.log("not added"));
				});
				prod.iWant.unshift({ userId });
			}

			prod.save()
				.then((resault) => {
					return res.json(resault);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ error: "intermal err" });
				});
		})
		.catch((err) => res.status(404).json(err));
};

///////////  end  add edit get search  product ///////////////

///////////  create cart , order | delet cart | get factor ///////////////

exports.getCart = (req, res, next) => {
	User.findOne({ _id: req.user.id })
		.populate(
			"cart.items.productId",
			"-comments -iWant -spec -creator -updatedAt -password -createdAt",
		)

		.then((user) => {
			res.json({
				products: user.cart.items,
			});
		})
		.catch();
};

exports.postCart = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					err: "product not found",
				});
			}
			return User.findOne({ _id: req.user.id }).then((usr) => {
				if (!usr) {
					return res.status(404).json({
						err: "product not found",
					});
				}
				usr.addToCart(product).then((result) => {
					return res.json(result);
				});
			});
		})

		.catch((err) => console.log(err));
};

exports.getUserIwant = (req, res, next) => {
	User.findOne({ _id: req.user.id })
		.populate(
			"iWant.productId",
			"-comments -iWant -spec -creator -updatedAt -password -createdAt",
		)

		.then((user) => {
			res.json({
				products: user.iWant,
			});
		})
		.catch();
};

exports.postIncCartItem = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					err: "product not found",
				});
			}
			return User.findOne({ _id: req.user.id }).then((usr) => {
				if (!usr) {
					return res.status(404).json({
						err: "usr not found",
					});
				}
				usr.incCount(product).then((result) => {
					return User.findOne({ _id: req.user.id })
						.populate(
							"cart.items.productId",
							"-comments -iWant -spec -creator -updatedAt -password -createdAt",
						)

						.then((user) => {
							res.json({
								products: user.cart.items,
							});
						})
						.catch();
				});
			});
		})

		.catch((err) => console.log(err));
};

exports.postDecCartItem = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					err: "product not found",
				});
			}
			return User.findOne({ _id: req.user.id }).then((usr) => {
				if (!usr) {
					return res.status(404).json({
						err: "product not found",
					});
				}
				usr.decCount(product).then((result) => {
					return User.findOne({ _id: req.user.id })
						.populate(
							"cart.items.productId",
							"-comments -iWant -spec -creator -updatedAt -password -createdAt",
						)

						.then((user) => {
							res.json({
								products: user.cart.items,
							});
						})
						.catch();
				});
			});
		})

		.catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const prodId = req.body.prodId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					err: "product not found",
				});
			}
			return User.findOne({ _id: req.user.id }).then((usr) => {
				if (!usr) {
					return res.status(404).json({
						err: "product not found",
					});
				}
				usr.deleteFromCart(product._id)
					.then((result) => {
						return User.findOne({ _id: req.user.id })
							.populate(
								"cart.items.productId",
								"-comments -iWant -spec -creator -updatedAt -password -createdAt",
							)

							.then((user) => {
								res.json({
									products: user.cart.items,
								});
							})
							.catch();
					})
					.catch((err) => {
						return res.status(404).json({ err: "not found" });
					});
			});
		})

		.catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	const city = req.body.city;
	const state = req.body.state;
	const name = req.body.name;
	const lastname = req.body.lastname;
	const address = req.body.address;

	// const items = [];

	return User.findOne({ _id: req.user.id }).then((user) => {
		if (!user) {
			return res.status(404).json({
				err: "user not found",
			});
		}
		let sum = 0;
		user.populate("cart.items.productId")
			.execPopulate()
			.then((user) => {
				if (user.cart.items.legth <= 0) {
					return res.status(404).json({
						err: "cart is empty",
					});
				}
				items = user.cart.items.map((i) => {
					sum += i.quantity * i.productId.price;
					return {
						product: { ...i.productId._doc },
						quantity: i.quantity,
					};
				});
				const order = Order({
					user: {
						email: req.user.email,
						userId: req.user.id,
					},
					items: items,
					name,
					lastname,
					address,
					city,
					state,
					price: sum,
				});
				return order.save();
			})
			.then(() => {
				return User.findOne({ _id: req.user.id }).then((user) => {
					user.clearCart();
				});
			})
			.then((result) => {
				return res.json({ done: "order craeted" });
			});
	});
};

/////

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user.id }).then((orders) => {
		res.json(orders);
	});
};

exports.getNotdeliveredOrders = (req, res, next) => {
	Order.find({ deliver: false }).then((orders) => {
		res.json(orders);
	});
};

exports.getdeliveredOrders = (req, res, next) => {
	Order.find({ deliver: true }).then((orders) => {
		res.json(orders);
	});
};

exports.postdeliveredOrder = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const did = req.body.deliverId;
	Order.findOne({ _id: did }).then((order) => {
		order
			.delivered()
			.then((resu) => {
				res.json(orders);
			})
			.catch((err) => {
				res.status(500).json({ done: "no" });
			});
	});
};

exports.postGetFactore = (req, res, next) => {
	const factoreId = req.body.fid;

	Order.findById(factoreId)
		.then((order) => {
			if (order.user.userId.toString() === req.user.id.toString()) {
				const fileInfo = "invoice-" + factoreId + ".pdf";
				const filePath = path.join("factores", fileInfo);
				const pdfDoc = new PDFDocument();
				res.setHeader("Content-Type", "application/pdf");
				res.setHeader(
					"Content-Disposition",
					'inline; filename="' + fileInfo + '"',
				);
				pdfDoc.pipe(fs.createWriteStream(filePath));
				pdfDoc.pipe(res);
				let totalPrice = 0;
				order.items.forEach((prod) => {
					totalPrice += prod.quantity * prod.product.price;
					pdfDoc
						.fontSize(14)
						.text(
							prod.product.title +
								" - " +
								prod.quantity +
								" x " +
								"$" +
								prod.product.price,
						);
				});
				pdfDoc.text("---");
				pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);
				pdfDoc.text("-----------------------");
				pdfDoc
					.fontSize(20)
					.text("sended to:" + order.name + " " + order.lastname);

				pdfDoc
					.fontSize(20)
					.text(
						"with address :" +
							order.city +
							" " +
							order.state +
							" " +
							order.address,
					);

				pdfDoc.end();
				res.sendFile(
					`${__dirname}/factores/"invoice-"${factoreId}".pdf"/`,
				);
			} else {
				res.status(400).json({ err: "wrong id" });
			}
		})
		.catch((err) => {
			res.status(500).json({ err });
			console.log({ err });
		});
};
