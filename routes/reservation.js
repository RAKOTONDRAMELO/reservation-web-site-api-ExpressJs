let express = require('express')
let reserver = express.Router()
let session = require('express-session')
reserver.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
reserver.get('/reservation',function(req,res,next){
  if (req.session.test){
    req.session.test = undefined
    if (req.session.users){
      if (req.session.reservation){
        res.locals.users = req.session.users
        res.locals.reservation = req.session.reservation
        res.locals.retour = {}
        res.locals.prix =  req.session.prix
        res.render('facture')
      }
      else {
        res.redirect('/client')
      }
    }
    else {
      res.redirect('/')
    }
  }
  else res.redirect('/client')
  next()
})

reserver.post('/reservation', function (req, res, next) {
  req.session.reservation = req.body
  let prix   
  if (req.body.effectif < 100){
    prix = 400000  
  }
  else {
    prix = (req.body.effectif * 4000)
  }
  req.session.prix = prix
  req.session.test = {}
  res.redirect('/reservation')
  next()
})

module.exports = reserver
