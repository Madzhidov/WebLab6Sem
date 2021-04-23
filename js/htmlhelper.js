const defaultCity = 'Saint Petersburg'

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
                await fillCharacteristics(defaultCity, params);
            })
    }, 0);
}

function removeButton(parentElement, rep, clone) {
    clone.querySelector('.btn3').addEventListener('click', async function () {
        await removeCity(rep.cityname.textContent);
        parentElement.removeChild(clone);
    });
}

async function createCard(type, cityName, templateID) {
    const parentElement = document.querySelector('.favorites__list');
    let clone = document.getElementById(templateID).content.firstElementChild.cloneNode(true);
    let defaultDisplay = clone.style.display
    // console.log(parent)

    parentElement.append(clone);

    const params = htmlToObject(clone);

    await dataLoad('create', clone,
        async function () {
            try {
                await postCity(cityName);
                let rep = await fillCharacteristics(cityName, params);

                console.log(clone.style.display, clone)
                removeButton(parentElement, rep, clone)
            }
            catch (er) {
                parentElement.removeChild(clone)
                alert(er)
            }
        }, 0);

}

async function loadLocalStorageCards() {
    const f = await getAll();
    f.favorites.forEach(cityStats => {
        console.log(cityStats)
        const parent = document.querySelector('.favorites__list');
        let clone = document.getElementById('city').content.firstElementChild.cloneNode(true);
        // console.log(parent , clone)
        parent.append(clone);
        const params = htmlToObject(clone);
        // console.log(params)
        dataLoad('create', clone,
            function () {
                let rep = fill(cityStats, params);
                removeButton(parent, rep, clone)
            },
            1000);
    })
}