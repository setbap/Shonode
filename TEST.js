const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.getProducts = (req, res, next) => {
	// console.log(req.user);

	// Product.find()
	// 	.then((products) => {
	// 		res.render("shop/product-list", {
	// 			prods: products,
	// 			pageTitle: "All Products",
	// 			path: "/products",
	// 			isAuthenticated: req.session.isLoggedIn,
	// 		});
	// 	})
	// 	.catch(() => console.log("err in get"));
	var perPage = 6;
	var page = req.query.page || 1;

	Product.find({})
		.skip(perPage * page - perPage)
		.limit(perPage)
		.then((products) => {
			Product.countDocuments().exec(function(err, count) {
				if (err) return next(err);
				res.render("shop/product-list", {
					prods: products,
					pageTitle: "All Products",
					path: "/products",
					isAuthenticated: req.session.isLoggedIn,
					products: products,
					current: page,
					pages: Math.ceil(count / perPage),
				});
			});
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.sort({ title: 1 })
		.exec((err, products) => {
			if (err) {
				return console.log("err in get");
			}

			return res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
				isAuthenticated: req.session.isLoggedIn,
			});
		});
};

exports.getProduct = async (req, res, next) => {
	const productId = req.params.id;
	try {
		const prod = await Product.findById(productId).exec();
		const product = await prod
			.populate("comments.userId", "email")
			.execPopulate();

		res.render("shop/product-detail", {
			product: product,
			pageTitle: "yah",
			path: "/products",
			isAuthenticated: req.session.isLoggedIn,
		});
	} catch (error) {
		console.log("getProduct");
	}
};

exports.getCart = (req, res, next) => {
	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then((user) => {
			// console.log();
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: user.cart.items,
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch();
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
	const pid = req.body.productId;
	req.user
		.deleteFromCart(pid)
		.then(() => res.redirect("/cart"))
		.catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
	const pid = req.body.productId;
	// const items = [];
	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then((user) => {
			items = user.cart.items.map((i) => {
				return {
					product: { ...i.productId._doc },
					quantity: i.quantity,
				};
			});
			const order = Order({
				user: {
					email: req.user.email,
					userId: req.user._id,
				},
				items: items,
			});
			return order.save();
		})
		.then(() => req.user.clearCart())
		.then(() => res.redirect("/orders"));
};

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id }).then((orders) => {
		res.render("shop/orders", {
			path: "/orders",
			pageTitle: "Your Orders",
			orders,
			isAuthenticated: req.session.isLoggedIn,
		});
	});
};

exports.getFactore = (req, res, next) => {
	const factoreId = req.params.factoreId;
	Order.findById(factoreId)
		.then((order) => {
			if (order.user.userId.toString() === req.user._id.toString()) {
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
				pdfDoc.end();
			} else {
				res.redirect("/orders");
			}
		})
		.catch((err) => {
			console.log(err);
			res.redirect("/orders");
		});
};

exports.postComment = async (req, res, next) => {
	const prodId = req.body.prodId;
	const comment = req.body.comment;
	try {
		const prod = await Product.findById(prodId);
		await prod.addComment(comment, req.user._id);
		return res.redirect(`/products/${prodId}`);
	} catch (err) {
		console.log(err);
	}
};
