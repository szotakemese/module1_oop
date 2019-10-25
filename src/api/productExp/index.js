const express = require("express");
const controller = require("./controller.js");
const productExpApiRouter = new express.Router();

productExpApiRouter.get("/", controller.productExpController.get);
productExpApiRouter.get("/sort", controller.productExpController.getSorted);
productExpApiRouter.get("/expensive", controller.productExpController.getExpensive);
productExpApiRouter.get("/:id", controller.productExpController.getId);
productExpApiRouter.post("/", controller.productExpController.post);
productExpApiRouter.delete("/:id", controller.productExpController.deleteId);


module.exports = {
	apiRouter:productExpApiRouter
}
