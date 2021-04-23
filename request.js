const APIurl = "http://shakhweather.herokuapp.com/";
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
   console.log(`${APIurl}weather/coordinates?lat=${location[0]}&lon=${location[1]}`);
   return fetch(
        `${APIurl}weather/coordinates?lat=${location[0]}&lon=${location[1]}`
    )
        .then(response => {

                return problemHandler(response);
            }
        );
}

async function requestCity(city) {
    return fetch(
        `${APIurl}weather/city?q=${city}`
    )
        .then(response => {

                return problemHandler(response);
            }
        );
}

async function postCity(city) {

    return fetch(
        `${APIurl}favorites?city=${city}`, {
            method: "POST"
        }
    ).then(response => {
            return problemHandler(response);
        }
    );
}

async function removeCity(city) {
    return fetch(
        `${APIurl}favorites?city=${city}`, {
            method: "DELETE"
        }
    ).then(response => {
            return problemHandler(response);
        }
    );
}

async function getAll() {
    return fetch(
        `${APIurl}favorites`
    ).then(response => {

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