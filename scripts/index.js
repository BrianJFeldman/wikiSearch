let d = document;
let title = d.querySelector('.title');
let logo = d.querySelector('.logo');
let categoryCache = {};
let querying = false;
function checkIfSearching(str) {
    if (str !== "" && !title.classList.contains("searching")) {
        d.querySelector('.logo').classList.add('searching');
        d.querySelector('.title').classList.add('searching');
        d.querySelector('.resultsList').style.display = 'block';
    }
    if (str == "" && d.querySelector(".title").classList.contains("searching")) {
        d.querySelector('.resultsList').style.display = 'none';
        d.querySelectorAll(".searching").forEach((ele) => ele.classList.remove('searching'))
    }
}
function clearList() {
    d.querySelectorAll('.resultsList li').forEach((ele) => {
        ele.textContent = "";
    })
};
async function getCategories(e) {
    let currString = "" + e.target.value
    //on each keypress, check if in 'searching'
    checkIfSearching(currString);
    if (currString !== "" && !querying) {
        querying = true;
        let resultsList = d.querySelector('.resultsList');
        //if there is something in the input and it's not in the cache, hit the API for categories
        if (!(currString in categoryCache)) {
            var data = await fetch(`https://en.wikipedia.org/w/api.php?` +
                `origin=*` +
                `&action=query` +
                `&generator=allcategories` +
                `&gacprefix=${currString}` +
                `&format=json`)
                .catch((e) => new Error(e));
            data = await data.json();
            categoryCache[currString] = data;
        }
        else {
            var data = categoryCache[currString]
        }
        let returnedData = data.query ? data.query.pages : { key: { title: "Category:No Categories Found" } };
        let nodes = d.querySelectorAll('.resultsList li');
        let ind = 0;
        clearList();
        for (key in returnedData) {
            //removing the 'category:' at the start of each string
            nodes[ind].style.display = "flex";
            nodes[ind++].textContent = `${returnedData[key].title.substring(9)}`;
        }
        while (ind <= 9) {
            nodes[ind++].style.display = 'none';
        }
        querying = false;
    }
    else {
        setTimeout(getCategories, 50, e)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let searchBar = d.querySelector("input");
    searchBar.addEventListener('keyup', getCategories)
    searchBar.addEventListener('search', function (e) {
        e.target.value = "";
        checkIfSearching("");
    })
})