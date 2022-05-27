var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
// const data = require('../userData');
const methods = require('../methods');
const User = require('../models/user');

// constantes para rutas de paginas, login y register
const loginPage = "../views/pages/login";
const registerPage = "../views/pages/register";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// registro de rutas
router.get('/home', function(req, res) {
  if (req.user) {
    res.render('home', {
      userName: req.user.fullName 
    });
  } else {
    res.render(loginPage, {
      message: "Inicie sesion para continuar",
      messageClass: "alert-danger"
    });
  }
});
router.get('/login', (req, res) => {
  res.render(loginPage);
});
router.get('/register', (req,res) => {
  res.render(registerPage);
});

router.post('/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  // validacion
  if (password === confirmPassword) {
    user = await User.findOne({ email: email })
    .then(user => {
      if(user) {
        res.render(registerPage, {
          message: "El usuario ya esta registrado",
          messageClass: "alert-danger"
        });
      } else {
        const hashedPassword = methods.getHashedPassword(password);
        const userDB = new User({
          'fullName': fullName,
          'email': email,
          'password': hashedPassword
        });
        userDB.save();
        
        res.render(loginPage, {
          message: "Registro exitoso. Inicie sesion",
          messageClass: "alert-success"
        });
      }
    })
  } else {
    res.render(registerPage, {
      message: "Las contaseñas no coinciden",
      messageClass: "alert-danger"
    });
  }

});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);

  user = await User.findOne({ email: email, password: hashedPassword })
    .then(user => {
      if(user){
        const authToken = methods.generateAuthToken();
        methods.authTokens[authToken] = user;
        res.cookie('AuthToken', authToken); //setting token
        res.redirect("/home"); //redirect
      } else {
        res.render(loginPage, {
          message: "Usuario y clave invalidos",
          messageClass: "alert-danger"
        });
      }
    }) 
});

router.get('/logout', (req, res) => {
  res.clearCookie('AuthToken');
  return res.redirect('/');
});

module.exports = router;
