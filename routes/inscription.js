let express = require('express')
let newUser = express.Router()
let connection = require('../config/database')
let session = require('express-session')
newUser.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

newUser.post('/inscription',async function (req, res,next) {
    let doublant = await new Promise((resolve,reject)=>
      {connection.query('SELECT cinClient from utilisateurs WHERE cinClient=?',[req.body.cin],(error,rows)=>{
        if(error) reject (error)
        else resolve (rows[0])
        })
      })
    if(doublant==undefined){
      if (req.session.users){
        req.session.index = {message:"Nouveau administrateur ajouté",alerte:"alert alert-success"}
        var user = 1
      }
      else {
        req.session.index = {message:"Votre inscription est achevé , veuillez vous connecter",alerte:"alert alert-success"}
        var user = 0
      }
      connection.query('INSERT INTO utilisateurs (nom,prenom,adresse,numero,cinClient,password,user) VALUES (?,?,?,?,?,?,?) ',
      [req.body.nom,req.body.prenom,req.body.adresse,req.body.tel,req.body.cin,req.body.pass,user],
      function (error){
      if(error) throw error;
    }) 
      if (user==1){
        res.redirect('/admin')
      }
      else res.redirect('/')
    }
    else {
      if (req.session.users){
        req.session.index = {message:"Ce C.I.N est déjà associé à un compte administrateur",alerte:"alert alert-danger"}
        res.redirect('/admin')
      }
      else{
        req.session.index = {message:"Ce C.I.N est déjà associé à un compte, veuillez utiliser un autre C.I.N ou vous indentifier",alerte:"alert alert-danger"}
        res.redirect('/')
      }
    }
    next()
})
module.exports= newUser