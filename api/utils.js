function requireUser(req, res, next) {
  if (!req.user){
      res.statusCode = 401
      res.send({
        error: "401",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedUserError"
      })
  }
  next()
}
    
module.exports = {
  requireUser
}