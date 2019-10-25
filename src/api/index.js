const express = require("express");
const productExp = require("./productExp");
const router = new express.Router();


router.use("/productExp", productExp.apiRouter);

module.exports = {
	router
}
