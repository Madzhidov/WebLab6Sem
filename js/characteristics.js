function htmlToObject(weatherReportList) {
    const keys = ['wind', 'cloud cover' ,'pressure', 'humidity', 'coordinates']
    const values = weatherReportList.getElementsByClassName('colum2');
    const obj = {};
    const params = {};
    for (let i = 0; i < keys.length; i += 1) {
    params[keys[i]] = values[i];
    }
  
    obj.params = params;
    obj.temperature = weatherReportList.getElementsByClassName('imgtemp')[0];
   
    obj.cityname = weatherReportList.getElementsByClassName('Piter__titel')[0];

    return obj;
}

function fill(req, params) {
    const weather = req.weather[0];
    const main = req.main;
    const report = params;
    report.temperature.textContent = Math.round(main.temp) + '°C';
    report.params['wind'].textContent = req['wind'].speed + ' m/s';
    report.params["cloud cover"].textContent = weather.description;
    report.params['pressure'].textContent = main.pressure + ' hpa';
    report.params['humidity'].textContent = main.humidity + ' %';
    report.params['coordinates'].textContent = `[${req.coord.lat.toFixed(2)}, ${req.coord.lon.toFixed(2)}]`;
    report.cityname.textContent = `${req.name}`;
    report.city = req.name;
    return report;
}

async function fillCharacteristics(locationOrCity, params) {
    if (typeof locationOrCity === 'string')
        var f =function () {return requestCity(locationOrCity)};
    else
        var f =function () {return requestLocation(locationOrCity)};

    return f(locationOrCity)
        .then(req => {
            fill(req, params);
            return req;
        })
        .catch(error => {
            alert(error);
        });
}
