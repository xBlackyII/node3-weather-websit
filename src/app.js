const path = require('path')
const express = require('express')
const hbs = require('hbs') // Wird erst für 'Partials' benötigt.

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Definiere die Dateipfade für Express.
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// -- Konfiguriere die 'handlebars engine' und den 'View'-Pfad:
// Teile express mit, mit welcher Template-Engine wir arbeiten. Hier hbs (handlebars)
app.set('view engine', 'hbs')
// Standardmäßig werden die Templates unter 'views' abgespeichert. Dieses muss nicht
// explizit angegeben werden! Möchte man jedoch den Namen der Templates ändern, muss 
// dieses Express mittels dem folgenden Kommando mitgeteilt werden:
app.set('views', viewsPath)

hbs.registerPartials(partialsPath)

// Teile express mit, wo das Arbeitsverzeichnis ist.
// Hier wird index.html aufgerufen.
app.use(express.static(publicDirectoryPath))

// Einstiegspunkt auf unsere Webseite...
app.get('', (req, res) => {
    // render muss ein Template übergeben werden. Hier index. 
    // express und hbs wissen nun, dass sie unter 'views' 
    // der Datei 'index.hbs' aufrufen müssen.
    res.render('index', {
        title: 'Weather App',
        name: 'Marc'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Marc'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Me',
        name: 'Marc'
    })
})

// app.com/weather
/**
 * 
 */
app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    // `geocode` needs the address to catch the temperature data.
    // It will callback the `data` or in case of failure an `error` message.
    geocode(address, (error, data) => {

        if (error) {
            return res.send({
                error
            })
        }
    
        forecast(data, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData.forecast,
                location: data.location,
                address: address
            })

            // console.log(`The temperature in ${data.location} is ${forecastData.temperature} °C. It is:`)
            // forecastData.description.forEach(item => console.log(item))
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Help article not found',
        name: 'Marc'
    })
})

// Wird zum Schluss eingefügt um alle die Seiten aufzufangen, die nicht 
// definiert sind... 404 Page!
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found.',
        name: 'Marc'
    })
})

// Start server
app.listen(port, () => {
    console.log('Server is up on server ' + port + '.')
})