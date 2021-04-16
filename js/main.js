window.onload = async function () {
    initLocalStorage();
    await Promise.all([loadLocalStorageCards(), currentLocationCard()]);
}

document.querySelector('.btn1').onclick = async function () {
    await currentLocationCard();
}

document.querySelector('.btn2').onclick = async function () {
    await createCard('create', document.getElementById('addcity').value, 'city');
    document.getElementById('addcity').value = '';
}