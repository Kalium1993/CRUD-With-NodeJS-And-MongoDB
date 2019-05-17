const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb://localhost:27017/CRUD"

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('CRUD')

    app.listen(3000, function() {
        console.log('server running on port 3000')
    })
})

/* msg original
app.get('/', (req, res) => {
    res.send("Hello World")
})

*/

app.use(bodyParser.urlencoded({ extended : true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/', (req, res) => {
    let cursor = db.collection('Data').find()
})

app.get('/show', (req, res) => {
    db.collection('Data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('Data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('user registered in DB')
        res.redirect('show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
    let id = req.params.id

    db.collection('Data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result })
    })
})
.post((req, res) => {
    let id = req.params.id
    let name = req.body.name
    let surname = req.body.surname

    db.collection('Data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log("User infos updated")
    })
})

app.route('/delete/:id')
.get((req,res) => {
    let id = req.params.id

    db.collection('Data').deleteOne({_id: new ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log("User removed")
        res.redirect('/show')
    })
})

//https://medium.com/baixada-nerd/criando-um-crud-completo-com-nodejs-express-e-mongodb-parte-3-3-b243d14a403c
//https://docs.mongodb.com/compass/master/connect/
//https://docs.mongodb.com/manual/reference/connection-string/
//https://cloud.mongodb.com/v2/5cdda66aff7a253a0c30ef43#clusters