function initLocalStorage() {
    if (window.localStorage.getItem("defaultCity") === null)
        localStorage["defaultCity"] = "Санкт-Петербург";
    if (window.localStorage.getItem("favoritesCities") === null)
        localStorage["favoritesCities"] = JSON.stringify(["Москва", "Душанбе"]);
}

function dataLoad(type, loadingNode, func, delay) {
    if (type === 'current' && loadingNode.parentNode.getElementsByClassName('mylocationweather').length === 2)
        return 0;
    const loadingNodeClone = loadingNode.cloneNode();
    const parentNode = loadingNode.parentNode;
    const loaderClone = document.getElementById('loader').content.firstElementChild.cloneNode(true);
    const defDisp = loadingNode.style.display;
    loadingNodeClone.append(loaderClone);
    loadingNodeClone.firstChild.style.margin = `${loadingNode.scrollHeight.valueOf() / 2.8}px auto`;
    loadingNode.style.display = 'none';
    loadingNodeClone.classList.add("loading");
    loadingNodeClone.style.display = 'block';
    parentNode.insertBefore(loadingNodeClone, parentNode.children[Array.prototype.indexOf.call(parentNode.children, loadingNode) + 1]);
    setTimeout(async function () {
        await func();
        loadingNode.style.display = defDisp;
        parentNode.removeChild(loadingNodeClone);
    }, delay);
}



async function currentLocationCard() {
    const currentCard = document.querySelector('.Piter');
    await dataLoad('current', currentCard, async function () {
        let params = htmlToObject(currentCard);
        navigator.geolocation.getCurrentPosition(async function (position) {
                await fillCharacteristics([position.coords.latitude, position.coords.longitude], params);
            },
            async function () {
                await fillCharacteristics(this.localStorage['defaultCity'], params);
            })
    }, 1200);
}

function favouriteCityStorageHandler(type, rep, clone) {
    if (type === 'create') {
        const citySet = new Set(JSON.parse(window.localStorage.getItem('favoritesCities')));
        if (citySet.has(rep.name)) {
            throw new CityinLocalStorag(rep.name);
        }
        // console.log('+')
        citySet.add(rep.name);
        window.localStorage.setItem('favoritesCities', JSON.stringify(Array.from(citySet)));
    }
     clone.querySelector('.btn3').addEventListener('click', function () {
        const citySet = new Set(JSON.parse(window.localStorage.getItem('favoritesCities')));
        citySet.delete(rep.city);
        window.localStorage.setItem('favoritesCities', JSON.stringify(Array.from(citySet)));
        parent.removeChild(clone);
    });

}

async function createCard(type, cityName, templateID) {
    const parent = document.getElementsByClassName('favorites__list')[0];
    let clone = document.getElementById(templateID).content.firstElementChild.cloneNode(true);
    const defVal = clone.style.display;
    clone.style.display = 'none';
    // console.log(parent)
	parent.append(clone);

    const params = htmlToObject(clone);
    await dataLoad('create', clone,
        async function () {
            fillCharacteristics(cityName, params)
                .then(rep => {

                    favouriteCityStorageHandler(type, rep, clone);
    				clone.style.display = defVal;

               		clone.querySelector('.btn3').addEventListener('click', function () {
                    const citySet = new Set(JSON.parse(window.localStorage.getItem('favoritesCities')));
                    // console.log(rep.city, "create", params)
                    citySet.delete(rep.name);
                    window.localStorage.setItem('favoritesCities', JSON.stringify(Array.from(citySet)));
                    parent.removeChild(clone);});
                })
                .catch(er => {
                    parent.removeChild(clone);
                    alert(er);
                });
        }, 900);


}

async function loadLocalStorageCards() {
    const arr = JSON.parse(window.localStorage.getItem('favoritesCities'));
    const f = await Promise.all(arr.map(
        async (cityName) => {
            return await requestCity(cityName);
        }
    ))

    f.forEach(cityStats => {
        const parent = document.querySelector('.favorites__list');
        let clone = document.getElementById('city').content.firstElementChild.cloneNode(true);
        // console.log(parent , clone)
        parent.append(clone);
        const params = htmlToObject(clone);
        // console.log(params)
        dataLoad('create', clone,
            function () {
                let rep = fill(cityStats, params);
                clone.querySelector('.btn3').addEventListener('click', function () {
                const citySet = new Set(JSON.parse(window.localStorage.getItem('favoritesCities')));
                citySet.delete(rep.city);
                window.localStorage.setItem('favoritesCities', JSON.stringify(Array.from(citySet)));
                parent.removeChild(clone);
    });
            },
            1000);
    })
}

function reAdding(name) {
    this.name = "ReAdding: ";
    this.message = `a card with location ${name} has already been added. You can't create two card for one city!`;
    this.toString = function () {
        return this.name + this.message;
    };
}