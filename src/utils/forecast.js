const request = require('request')

const forecast = (coordinate = {}, callback) => {
    const latitude = coordinate.latitude
    const longitude = coordinate.longitude
    const url = 'http://api.weatherstack.com/forecast?access_key=89dd2f37f60522b06001e6d5db2ea1cd&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)
    console.log(url)
    request({ url: url, json: true}, (error, response) => {
        if (error) {
            callback('Unable to connect to weatherstack services!', undefined)
        } else if (response.body.error) {
            callback(response.body.error.info, undefined)
        } else {
            const location = response.body.location.name + ' (' + response.body.location.region + '/' + response.body.location.country + ')'
            callback(undefined, {
                forecast: `The temperature in ${location} is currently ${response.body.current.temperature} °C. The wind speed is ${response.body.current.wind_speed} km/h and comes from ${response.body.current.wind_dir}. There is a ${response.body.current.precip} % chance of rain.`,
                location: response.body.request.query
            })
        }
    })
}

module.exports = forecast