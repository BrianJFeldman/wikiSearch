let d = document;
let title = d.querySelector('.title');
let logo = d.querySelector('.logo');

function checkIfSearching(str) {
    if (str !== "" && !title.classList.contains("searching")) {
        d.querySelector('.logo').classList.add('searching');
        d.querySelector('.title').classList.add('searching');
    }
    if (str == "" && d.querySelector(".title").classList.contains("searching")) {
        d.querySelectorAll(".searching").forEach((ele) => ele.classList.remove('searching'))
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let searchBar = d.querySelector("input");
    searchBar.addEventListener('keyup', async function (e) {
        let currString = "" + e.target.value
//on each keypress, check if in 'searching'
        checkIfSearching(currString);
        if (currString !== "") {
//if there is something in the input, hit the API for categories
            let data = await fetch(`https://en.wikipedia.org/w/api.php?` +
                `origin=*` +
                `&action=query` +
                `&generator=allcategories` +
                `&gacprefix=${currString}` +
                `&format=json`)
                .catch((e) => new Error(e));
            data = await data.json();
            let returnedData = data.query.pages;
            for (key in returnedData) {
                let item = d.createElement('li');
//removing the 'category:' at the start of each string
                item.appendChild(d.createTextNode(`${returnedData[key].title.substring(9)}`));
                item.classList.add('result')
                d.querySelector('.resultsList').appendChild(item)
            }
        }
    })
    searchBar.addEventListener('search', function (e) {
        e.target.value = "";
        checkIfSearching("");
    })
})