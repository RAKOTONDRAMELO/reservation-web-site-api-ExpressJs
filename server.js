let express = require('express')
let app = express()
let moment = require('moment')
let connection = require('./config/database')
let session = require('express-session')
let cors = require('cors')
let bodyParser = require('body-parser')

app.use(session({
  secret: 'tenymiafina',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())
//FRONT
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
//app.use(express.json)
app.use(function(req,res,next){
  var date = Date().now
  connection.query('DELETE FROM reservations WHERE date < ?',[moment(date).locale("fr-ca").format("L")],(err)=>{
    if (err) throw err
    })
  next()
})


app.get('/',async function (req, res,next) {

  if (req.session.users == undefined){

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

    if (req.session.index){
      res.locals.index = req.session.index
      req.session.index = undefined
      res.render('index')
    }
    else{
      res.locals.index = {message:"",alerte:""}
      res.render('index')
    }
  }
  else{
    res.redirect('/client')
    }
  next()
});  





//AUTHENTIFICATION
let client = require('./routes/authentification')
app.use('/',client)
//INSCRIPTION
let inscription = require('./routes/inscription')
app.use('/',inscription)
//RESERVATION
let reservation = require('./routes/reservation')
app.use('/',reservation)
//CONFIRMATION
let confirmation = require('./routes/confirmation')
app.use('/',confirmation)
//ADMINISTRATION
let administrer = require('./routes/administration')
app.use('/',administrer)
//MOBILE
let mobile = require('./routes/mobile')
app.use('/',mobile)
//LOCALHOST
app.listen('8024', function(req,res){
    console.log("DEMARRAGE")
})