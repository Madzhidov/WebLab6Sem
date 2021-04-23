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
    const report = params;
    report.temperature.textContent = req.temp;
    report.params['wind'].textContent = req.wind;
    report.params["cloud cover"].textContent = req.cloud;
    report.params['pressure'].textContent = req.press;
    report.params['humidity'].textContent = req.humidity;
    report.params['coordinates'].textContent = `[${req.coords.lat}, ${req.coords.lon}]`;
    report.cityname.textContent = `${req.city}`;
    return report;
}

async function fillCharacteristics(locationOrCity, params) {
    if (typeof locationOrCity === 'string')
        var f =function () {return requestCity(locationOrCity)};
    else
        var f =function () {return requestLocation(locationOrCity)};

    return f(locationOrCity)
        .then(req => {
            return fill(req, params);
        })
        .catch(error => {
            alert(error);
        });
}
