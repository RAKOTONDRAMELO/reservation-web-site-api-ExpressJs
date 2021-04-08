let express = require('express')
let administrer = express.Router()
let session = require('express-session')
let connection = require('../config/database')
let moment = require('moment')
administrer.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

administrer.get('/admin',async function(req,res,next){
    if (req.session.users == undefined){
        res.redirect('/')
      }
    else if (req.session.users.user == 1){
        let listeReservation = await new Promise((resolve,reject)=>
        {
            connection.query('SELECT * from reservations ORDER BY date',(error,rows)=>{
                if (error) reject (error)
                else resolve (rows)
            })
        } 
        ) 

        let listeUser = await new Promise((resolve,reject)=>
        {
            connection.query('SELECT * from utilisateurs ORDER BY nom ',(error,rows)=>{
                if (error) reject (error)
                else resolve (rows)
            })
        } 
        ) 

        let liste = []
        for (i=0;i<listeReservation.length;i++){
            liste[i] = listeReservation[i]
        }

        let listeU = []
        for (i=0;i<listeUser.length;i++){
            listeU[i] = listeUser[i]
        }

        res.locals.moment = moment
        res.locals.reservation = liste 
        res.locals.users = listeU
        res.locals.utilisateur = req.session.users
        if (req.session.index){
            res.locals.index = req.session.index
            req.session.index = undefined
            res.render('admin')
        }
        else {
            res.locals.index = {message:"",alerte:""}
            res.render('admin')
        }
    }
    else res.redirect('/client')
    next()
})

administrer.post('/confirmer',async function(req,res,next){
    if (req.body.pass == req.session.users.password){
        let doublant = await new Promise((resolve,reject)=>{
            connection.query('SELECT * from reservations WHERE date = ?',[req.body.date],(err,rows)=>{
                if (err) reject (err)
                else resolve (rows)
            })    
        }
        )
        if (doublant[0]){
            if (doublant[0].cinClient == req.body.cinClient){
                connection.query('UPDATE reservations SET cinAdmin = ? , effectif = ? , couleur = ? , prix = ?   WHERE reservations.date = ? ',[req.session.users.cinClient,req.body.effectif,req.body.color,req.body.prix,doublant[0].date],(err)=>{
                if (err) throw err})
                req.session.index = {message:"Confirmation achevé  ",alerte:"alert alert-success"}
            }       
            else {
                req.session.index = {message:"Date indisponible ",alerte:"alert alert-danger"}
            }
        }
        else {
            connection.query('INSERT INTO reservations (date,effectif,couleur,cinAdmin,prix,cinClient) VALUES (?,?,?,?,?,?) ',
            [req.body.date,req.body.effectif,req.body.color,req.session.users.cinClient,req.body.prix,req.body.cinClient],
            function (error){
            if(error) throw error;       
          }) 
            req.session.index = {message:"Date changé, veuillez supprimer l'ancienne réservation!!!",alerte:"alert alert-success"}    
        }
        res.redirect('/admin')
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})

administrer.post('/annuler',async function(req,res,next){
    if (req.body.pass == req.session.users.password){
        let doublant = await new Promise((resolve,reject)=>{
            connection.query('SELECT * from reservations WHERE date = ?',[req.body.date],(err,rows)=>{
                if (err) reject (err)
                else resolve (rows)
            })    
        }
        )
        if (doublant[0]){
            if (doublant[0].cinClient == req.body.cinClient){
                connection.query('UPDATE reservations SET cinAdmin = 0 WHERE date = ?',[req.body.date],(err)=>{
                    if (err) throw err
                })
                req.session.index = {message:"Confirmation annulé !!!  ",alerte:"alert alert-success"}
            }       
            else {
                req.session.index = {message:"Informations non correspondantes ",alerte:"alert alert-danger"}
            }
        }
        res.redirect('/admin')
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})

administrer.post('/supprimer',async function(req,res,next){
    if (req.body.pass == req.session.users.password){
        let doublant = await new Promise((resolve,reject)=>{
            connection.query('SELECT * from reservations WHERE date = ?',[req.body.date],(err,rows)=>{
                if (err) reject (err)
                else resolve (rows)
            })    
        }
        )
        if (doublant[0]){
            if (doublant[0].cinClient == req.body.cinClient){
                connection.query('DELETE FROM reservations WHERE date = ?',[req.body.date],(err)=>{
                    if (err) throw err
                })
                req.session.index = {message:"Réservation supprimé!!!  ",alerte:"alert alert-success"}
            }       
            else {
                req.session.index = {message:"Informations non correspondantes ",alerte:"alert alert-danger"}
            }
        }
        res.redirect('/admin')
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})

administrer.post('/changer',function(req,res,next){
    if (req.body.pass == req.session.users.password){
        connection.query('UPDATE utilisateurs SET nom = ? , prenom = ? , adresse = ? , numero = ?   WHERE utilisateurs.cinClient = ? ',
            [req.body.nom,req.body.prenom,req.body.Adresse,req.body.numero,req.body.cinClient],(err)=>{
            if (err) throw err})
            req.session.index = {message:"Changement achevé  ",alerte:"alert alert-success"}  
        res.redirect('/admin')
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})


administrer.post('/delete',function(req,res,next){
    if (req.body.pass == req.session.users.password){
        connection.query('DELETE FROM utilisateurs WHERE cinClient = ?',[req.body.cinClient],(err)=>{
            if (err) throw err
            })
        res.redirect('/admin')
        req.session.index = {message:"Compte supprimé!!!",alerte:"alert alert-success"}
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})

administrer.post('/certifier', async function(req,res,next){
    if (req.body.pass == req.session.users.password){

        connection.query('UPDATE utilisateurs SET user = 1 WHERE cinClient = ?',[req.body.cinClient],(err)=>{
        if (err) throw err
        })
        req.session.index = {message:"Certification terminé !!!",alerte:"alert alert-success"}
        res.redirect('/admin')
    }
    else {
        req.session.index = {message:"Mot de passe incorrect!!!",alerte:"alert alert-danger"}
        res.redirect('/admin')
    }
    next()
})

module.exports = administrer 