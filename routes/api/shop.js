const express = require("express");
const controller = require("../../controllers/api/shop");
const orderAdmin = require("../../middlewares/orderAdmin");
const passport = require("passport");
const newBrandValid = require("../../validations/shop/newBrand");
const newProductValid = require("../../validations/shop/newProduct");
const newCategoryValid = require("../../validations/shop/newCategory");
const newCommentValid = require("../../validations/shop/newComment");
const newiWantValid = require("../../validations/shop/newiWant");
const newAddToCart = require("../../validations/shop/newAddToCart");
const getProductsValid = require("../../validations/shop/getProducts");
const getProductValid = require("../../validations/shop/getSingleProduct");

const router = express.Router();

// route  : post api/shop/allBrands
// access : public
// why    : to get all brands
router.get("/allBrands", controller.getBrands);

// route  : post api/shop/allCategoreis
// access : public
// why    : to get all Categoreis
router.get("/allCategoreis", controller.getCategories);

// route  : post api/shop/newBrand
// access : private-->orderAdmin
// why    : to add new brand
router.post(
	"/newBrand",
	passport.authenticate("jwt", { session: false }),
	newBrandValid.list,
	orderAdmin,
	controller.postBrand,
);

// route  : post api/shop/newCategry
// access : private-->orderAdmin
// why    : to add new brand
router.post(
	"/newCategry",
	passport.authenticate("jwt", { session: false }),
	newCategoryValid.list,
	orderAdmin,
	controller.postCategory,
);

// route  : post api/shop/newCategry
// access : private-->orderAdmin
// why    : to add new brand
router.post(
	"/searchCategory",
	// newCategoryValid.list,
	controller.postFindCategories,
);

// route  : post api/shop/newCategry
// access : private-->orderAdmin
// why    : to add new brand
router.post(
	"/searchBrand",
	// newCategoryValid.list,
	controller.postFindBrands,
);

// route  : post api/shop/addproduct
// access : private-->orderAdmin
// why    : to add new product
router.post(
	"/addproduct",
	passport.authenticate("jwt", { session: false }),
	newProductValid.list,
	controller.postAddProduct,
);

// route  : post api/shop/getproducts
// access : public
// why    : to view products
router.post("/getproducts", getProductsValid.list, controller.postGetProducts);

// route  : post api/shop/getsingleproduct
// access : public
// why    : to view one product
router.post(
	"/getsingleproduct",
	getProductValid.list,
	controller.postGetSingleProduct,
);

// route  : post api/shop/searchProducts
// access : public
// why    : to view one product
router.post("/searchProducts", controller.postFindProducts);

// route  : post api/shop/comment
// access : private
// why    : post new comment in product
router.post(
	"/comment",
	passport.authenticate("jwt", { session: false }),
	newCommentValid.list,
	controller.postComment,
);

// route  : post api/shop/comment
// access : private
// why    : post new comment in product
router.post(
	"/iWant",
	passport.authenticate("jwt", { session: false }),
	newiWantValid.list,
	controller.postiWant,
);

// route  : post api/shop/addToCart
// access : private
// why    : post new comment in product
router.post(
	"/addToCart",
	passport.authenticate("jwt", { session: false }),
	newAddToCart.list,
	controller.postCart,
);

// route  : post api/shop/getMyCart
// access : private
// why    : post new comment in product
router.get(
	"/getMyCart",
	passport.authenticate("jwt", { session: false }),

	controller.getCart,
);

// route  : post api/shop/incCartItem
// access : private
// why    : to increase count of one product in cart
router.post(
	"/incCartItem",
	passport.authenticate("jwt", { session: false }),
	newAddToCart.list,
	controller.postIncCartItem,
);

// route  : post api/shop/decCartItem
// access : private
// why    : to decrease count of one product in cart
router.post(
	"/decCartItem",
	passport.authenticate("jwt", { session: false }),
	newAddToCart.list,
	controller.postDecCartItem,
);

// route  : post api/shop/deleteCartItem
// access : private
// why    : to delete one product in cart
router.post(
	"/deleteCartItem",
	passport.authenticate("jwt", { session: false }),
	newAddToCart.list,
	controller.postDeleteCartItem,
);

module.exports = router;
