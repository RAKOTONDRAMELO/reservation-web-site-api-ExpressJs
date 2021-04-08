let express = require('express')
let mobile = express.Router()
let connection = require('../config/database')
let session = require('express-session')

mobile.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

mobile.post('/booking', async (req,res,next) => {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit' };
    let message 
    let prix 
    let date = new Date(req.body.date).toLocaleDateString("fr-ca",options)
    if (req.body.nombreDePersonnes <= 100){
      prix = 400000
    }
    else {
      prix = req.body.nombreDePersonnes*4000
    }
    let doublant = await new Promise((resolve,reject)=>{connection.query('SELECT date from reservations WHERE date=?',[date],(error,rows)=>{
      if(error) reject (error)
      else resolve (rows[0])
      })
    })
    if(doublant==undefined){
      connection.query('INSERT INTO reservations (date,effectif,couleur,prix,cinClient,cinAdmin) VALUES (?,?,?,?,?,?) ',
          [date,req.body.nombreDePersonnes,"#000000",prix,req.body.cin,"0"],
          function (error){
          if(error) throw error;
      }) 
      message = "Votre réservation a été envoyé avec succes"
    }
    else message="Veuillez actualiser le calendrier pour vérifier la disponibilité de cette date"
    res.json(message)
    next()
  })

mobile.get('/indisponible', async (req,res,next) => {
    let listeReservation = await new Promise((resolve,reject)=>
          {
              connection.query('SELECT * from reservations ORDER BY date',(error,rows)=>{
                  if (error) reject (error)
                  else resolve (rows)
              })
          } 
          )
    res.json(listeReservation)
    next()
  })

module.exports = mobile