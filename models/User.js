const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		resetCode: {
			type: String,
			required: false,
		},
		resetTime: {
			type: Date,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		iWant: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
			},
		],
		cart: {
			items: [
				{
					productId: {
						type: Schema.Types.ObjectId,
						required: true,
						ref: "Product",
					},
					quantity: {
						type: Schema.Types.Number,
						required: true,
					},
				},
			],
		},
	},
	{ timestamps: true },
);

userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.postIwant = function(prodId) {
	const IwantIndex = this.iWant.findIndex((cp) => {
		return cp.productId.toString() === prodId.toString();
	});
	// let newQuantity = 1;
	let updatedIwant = [...this.iWant];

	if (IwantIndex >= 0) {
		updatedIwant = this.iWant.filter((item) => {
			return item.productId.toString() !== prodId.toString();
		});
	} else {
		updatedIwant.push({ productId: prodId });
	}
	// const updatedCart = {
	// 	items: updatedIwant,
	// };
	this.iWant = updatedIwant;
	return this.save();
};

userSchema.methods.incCount = function(product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		return Promise.reject();
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.decCount = function(product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	let updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity - 1;
		if (newQuantity === 0) {
			updatedCartItems = this.cart.items.filter((item) => {
				return item.productId.toString() !== product._id.toString();
			});
		} else {
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}

		const updatedCart = {
			items: updatedCartItems,
		};
		this.cart = updatedCart;
	}

	return this.save();
};

userSchema.methods.deleteFromCart = function(productId) {
	const updatedCartItems = this.cart.items.filter((item) => {
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function() {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model("User", userSchema);
