let express = require('express')
let user = express.Router()
let connection = require('../config/database')
let session = require('express-session')
let moment = require('moment')
user.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

user.post('/deconnexion',function(req,res,next){
    req.session.users = undefined
    req.session.index = undefined
    res.redirect('/client')
    next()
  })
  
user.get('/client',async function (req,res,next){
    if (req.session.users == undefined){
      res.redirect('/')
    }
    else{
      let listeReservation = await new Promise((resolve,reject)=>
      {
          connection.query('SELECT * from reservations ORDER BY date',[req.body.recherche],(error,rows)=>{
              if (error) reject (error)
              else resolve (rows)
          })
      } 
      ) 
      let liste = []
      for (i=0;i<listeReservation.length;i++){
          liste[i] = listeReservation[i]
      }
      res.locals.moment = moment
      res.locals.reservation = liste 
      res.locals.utilisateur = req.session.users
      res.render('client')
    }
    next()
  })
  
user.post('/connexion',async function (req, res, next) {
  if (req.body.membre == "client"){
    let client = await new Promise((resolve,reject)=>
      {connection.query('SELECT * from utilisateurs WHERE (cinClient = ? && password = ? && user = 0)',[req.body.cin,req.body.pass],(error,rows) => {
        if(error) reject (error)
        else resolve (rows[0]) 
      })
    })
    req.session.users = client
    req.session.index = {message:"Vos informations ne sont pas valides , veuillez vous identifiez avec des informations valides ",alerte:"alert alert-danger"}
    res.redirect('/client')   
  }
  else {
    let admin = await new Promise((resolve,reject)=>
      {connection.query('SELECT * from utilisateurs WHERE (cinClient = ? && password = ? && user = 1)',[req.body.cin,req.body.pass],(error,rows) => {
        if(error) reject (error)
        else resolve (rows[0]) 
      })
    })
    if (admin){
      req.session.users = admin
      res.redirect('/admin') 
    }
    else{
      req.session.index = {message:"Vos informations ne sont pas valides , veuillez vous identifiez avec des informations valides ",alerte:"alert alert-danger"}
      res.redirect('/')
    }
  }      
  next()  
  })
  
module.exports = user