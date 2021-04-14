const APIurl = "https://api.openweathermap.org/data/2.5/weather";
const APIkey = "23b165255fbf21ce4cfa7be39b155b62";
const APIlang = "ru";
const APIunits = "metric";
const badRequestStatuses = new Map([
        [400, 'Ошибка ввода!'],
        [401, 'Проблемы с подключением'],
        [404, 'Неправильное название города'],
        [429, 'Превышен лимит']
    ]
);

function problemHandler(response) {
    if (badRequestStatuses.has(response.status)) {
        throw new errorrequest(badRequestStatuses.get(response.status), response.status);
    }
    if (response.status === 200) {
        return response.json();
    }
}

async function requestLocation(location) {
    return fetch(
        `${APIurl}?appid=${APIkey}&lang=${APIlang}&lat=${location[0]}&lon=${location[1]}&units=${APIunits}`
    )
        .then(response => {
                return problemHandler(response);
            }
        );
}

async function requestCity(city) {
    return fetch(
        `${APIurl}?appid=${APIkey}&lang=${APIlang}&q=${city}&units=${APIunits}`
    )
        .then(response => {
                return problemHandler(response);
            }
        );
}


function errorrequest(message, status) {
    this.name = `Error request`;
    this.status = status;
    this.message = message;
    this.toString = function () {
        return `${this.name}: (${this.status}). ${this.message}`;
    };
}