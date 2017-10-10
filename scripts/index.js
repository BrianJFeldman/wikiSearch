let d = document;
let title = d.querySelector('.title');
let logo = d.querySelector('.logo');
let nodes = d.querySelectorAll('.result');
const categoryCache = {};
let querying = false;
let showingExtract = false;
let currString ="";

function checkIfSearching(str) {
    if (str !== "" && !title.classList.contains("searching")) {
        logo.classList.add('searching');
        title.classList.add('searching');
        d.querySelector('.resultsList').style.display = 'block';
    }
    if (str == "" && d.querySelector(".title").classList.contains("searching")) {
        d.querySelector('.resultsList').style.display = 'none';
        d.querySelectorAll(".searching").forEach((ele) => ele.classList.remove('searching'))
    }
}
function updateListNames(arr) {
    let ind = 0;
    while (typeof arr[ind] !== "undefined" && ind < 10) {
        nodes[ind].style.display = "flex";
        nodes[ind].childNodes[0].textContent = arr[ind++];
    }
    while (ind < 10) {
        nodes[ind++].style.display = "none";
    }
}
function clearList() {
    showingExtract=false;
    //function to remove the text from each of the result list items and remove withExtract class
    nodes.forEach((ele) => {
        //remove text from the 'names' paragprah
        ele.childNodes[0].textContent = "";
        //remove text from the 'extract' paragprah
        ele.childNodes[1].textContent = "";
        //remove text from the 'pid' paragprah
        ele.childNodes[2].textContent = "";
        if(ele.classList.contains('withExtract')) ele.classList.remove('withExtract');
    })
};

//function to handle input box keypresses and Category retreaval
async function getCategories(e) {
    //if the keypress is enter, send the user to that wikipedia page
    if (e.keyCode === 13) {
        window.location.assign(`https://en.wikipedia.org/wiki/${currString}`)
    }
    //on each keypress, check if app is 'searching'
    checkIfSearching(e.target.value);
    if (e.target.value !== "" && !querying) {
        currString = "" + e.target.value;
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
        clearList();
        const textArr = [];
        for (key in returnedData) {
            //remove the 'category:' at the start of each string
            textArr.push(returnedData[key].title.substring(9));
        }
        updateListNames(textArr);
        querying = false;
    }
    else if (currString !== "") {
        setTimeout(getCategories, 50, e)
    }
}
//function to handle clicks on categories and retreave pages
async function getPages(e) {
    //pull category for the list item
    let category = this.textContent;
    if (showingExtract) {
        window.location.assign(`https://en.wikipedia.org/wiki/?curid=${this.childNodes[2].textContent}`)
    }
    else {
        d.querySelector('input').value = currString = category;
        //fetch the pages from that category
        let categoryUrl = `https://en.wikipedia.org/w/api.php?` +
            `&action=query` +
            `&origin=*` +
            `&format=json` +
            `&cmtitle=Category:` + encodeURIComponent(category) +
            `&list=categorymembers` +
            `&cmnamespace=0`;
        let wikiPages = await fetch(categoryUrl)
            .catch((e) => new Error(e));
        //parse the returned page data for IDs
        wikiPages = await wikiPages.json();
        //request page extracts
        const pageIDs = [];
        const pageTitles = [];
        wikiPages.query.categorymembers.forEach((ele) => {
            pageIDs.push(ele.pageid);
            pageTitles.push(ele.title)
        })
        let extractsUrl = `https://en.wikipedia.org/w/api.php?` +
            `&action=query` +
            `&origin=*` +
            `&format=json` +
            `&pageids=${pageIDs.join("|")}` +
            `&prop=extracts` +
            `&exchars=150` +
            `&exlimit=10` +
            `&exintro=true` +
            `&explaintext=true`;
        let pageData = await fetch(extractsUrl)
        pageData = await pageData.json()
        pageData = pageData.query ? pageData.query.pages : { page: { title: "No Items Found In That Category" } };
        clearList();
        const pageTitleArr = [];
        const pageIDArr = [];
        const pageExtractArr = [];
        for (page in pageData) {
            pageTitleArr.push(pageData[page].title);
            pageIDArr.push(pageData[page].pageid);
            pageExtractArr.push(pageData[page].extract);
        }
        //add new pages and extract data to the result list items
        updateListNames(pageTitleArr);
        let text, ind = 0;
        while (ind < 10 && typeof pageIDArr[ind] !== 'undefined') {
            nodes[ind].childNodes[1].textContent = pageExtractArr[ind]
            nodes[ind].childNodes[2].textContent = pageIDArr[ind]
            nodes[ind++].classList.add('withExtract');
        }
        showingExtract = true;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let searchBar = d.querySelector("input");
    searchBar.addEventListener('keyup', getCategories)
    searchBar.addEventListener('search', function (e) {
        e.target.value = "";
        checkIfSearching("");
        clearList();
    })
    d.querySelectorAll('.result').forEach((ele) => {
        ele.addEventListener('click', getPages)
    })
})