module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.redirect('/signin');
  } // verificarIdentificacion(req, res, next) {
  //     console.log("Aqui")
  //     console.log(req.body)
  //     if (req.body) {
  //         return true;
  //     }
  //     // return res.redirect('/personero');
  // }


};