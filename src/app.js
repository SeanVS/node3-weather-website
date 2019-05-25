const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => 
{
    res.render('index', 
    {
        title: 'Test',
        name: 'Sarah'
    })
})

app.get('/about', (req, res) =>
{
    res.render('about',
    {
        title: "About me",
        name: 'Sarah'
    })
})

app.get('/help', (req, res) =>
{
    res.render('help',
    {
        message: "This is a help message",
        title: 'Help page',
        name: 'Sarah'
    })
})

app.get('/weather', (req, res) =>
{
    if (!req.query.address)
    {
        return res.send(
            {
                error: 'An address is required'
            }
        )
    }
    geocode(req.query.address, (error, {location, latitude, longitude} = {}) =>
    {
        if (error)
        {
            return res.send(
                { 
                    error
                })
        }
    
        //console.log("Data", data)
        if (!error)
        {
            forecast(latitude, longitude, (error, forecastData) => {
                if (error)
                {
                    return res.send('Error', error)
                }
                res.send(
                    {
                        address: req.query.address,
                        location: location,
                        forecast: forecastData
                    }
                )
            })
        }
    })
})

app.get('/products', (req, res) =>
{
    if (!req.query.search)
    {
        return res.send(
            {
                error: "Provide a search term"
            }
        )
    }
    res.send(
        {
            product: []
        }
    )
})

app.get('/help/*', (req, res) =>
{
    res.render('error', 
    {
        errorMessage: "Help article not found",
        title: "404",
        name: "Sarah"
    })
})

app.get('*', (req, res) =>
{
    res.render('error', 
    {
        errorMessage: "Page not found",
        title: "404",
        name: "Sarah"
    })
})

app.listen(3000, () =>
{
    console.log("Server is up on port 3000")
})