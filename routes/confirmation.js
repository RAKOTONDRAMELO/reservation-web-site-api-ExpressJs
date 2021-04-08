let express = require('express')
let confirmer = express.Router()
let connection = require('../config/database')
let session = require('express-session')
confirmer.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
confirmer.get('/confirmation',function(req,res,next){
    if (req.session.retour){
        res.locals.retour = req.session.retour
        req.session.retour = undefined
        res.locals.users = req.session.users
        res.locals.reservation = req.session.reservation
        res.locals.prix =  req.session.prix
        res.render('facture')
    }
    else res.redirect('/')
    next()
})
confirmer.post('/retour',function(req,res,next){
    res.redirect('/admin')
    next()
})
confirmer.post('/confirmation',async function(req,res,next){
    if (req.session.users == undefined){
        res.redirect('/')
    }
    else {
        if (req.body.pass == req.session.users.password){
            req.session.retour = {message:"réservation envoyé",alert:"alert alert-success",color:req.body.color}
            let doublant = await new Promise((resolve,reject)=>{connection.query('SELECT date from reservations WHERE date=?',[req.session.reservation.date],(error,rows)=>{
                if(error) reject (error)
                else resolve (rows[0])
                })
            })
    
            if(doublant==undefined){
                if (req.session.users.user == 1){
                    var cin = req.body.cin 
                    var conf = req.session.users.cinClient
                }
                else{
                    var cin = req.session.users.cinClient 
                    var conf = 0
                }
                connection.query('INSERT INTO reservations (date,effectif,couleur,prix,cinClient,cinAdmin) VALUES (?,?,?,?,?,?) ',
                    [req.session.reservation.date,req.session.reservation.effectif,req.body.color,req.session.prix,cin,conf],
                    function (error){
                    if(error) throw error;
                }) 
            }
            else req.session.retour.message="Ce réservation a déjà été enregistré"
            res.redirect("/confirmation")
        }
        else {
            req.session.retour = {message:"Mot de passe incorrect : réservation non envoyé",alert:"alert alert-danger",color:req.body.color}
            res.redirect("/confirmation")
        }
    }
    next()
})
module.exports = confirmer

