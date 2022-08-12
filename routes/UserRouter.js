const Router = require("express").Router()
const controller = require("../controllers/UserController")

Router.get("/get-users", controller.GetUsers)
Router.get("/:user_id", controller.GetUser)
Router.post("/new-user", controller.CreateUser)
Router.put("/:user_id", controller.UpdateUser)
Router.delete("/:user_id", controller.DeleteUser)
// Router.post('/register',
// contr.Register)

module.exports = Router
