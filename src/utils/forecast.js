const request = require('request')

//
// Goal: Create a reusable function for getting the forecast
//
// 1. Setup the "forecast" function in utils/forecast.js
// 2. Require the function in app.js and call it as shown below
// 3. The forecast function should have three potential calls to callback:
//    - Low level error, pass string for error
//    - Coordinate error, pass string for error
//    - Success, pass forecast string for data (same format as from before)

const forecast = (latitude, longitude, callback) =>
{
    const url = "https://api.darksky.net/forecast/75d14a30b365e5a13d3140299cb7753a/" + latitude + "," + longitude + "?units=si"

    request({url, json: true}, (error, {body}) => 
    {
        if (error)
        {
            callback("Check connection", undefined)
        }
        else if (body.error)
        {
            callback("Unable to get forecast! Try another location", undefined)
        }
        else
        {
            callback(undefined, 
                {
                    summary: body.currently.summary,
                    temperature: body.currently.temperature,
                    precipitation_chance: body.currently.precipProbability,
                    forecast: body.currently.summary + '. The temperature is currently ' 
                    + body.currently.temperature + ' degrees (c), and the chance for rain is ' + (body.currently.precipProbability  * 100) + '%. Wind speed is currently ' 
                    + body.currently.windSpeed
                })
        }
    })
}

module.exports = forecast