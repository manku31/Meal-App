// selectors
const searchBar = document.getElementById("search");
const searchItems = document.querySelector(".search-items");
const searchBtn = document.getElementById("search-btn");

// event listeners
searchBtn.addEventListener('click', searchMeal)
searchItems.addEventListener("click", addFavList);

// function
function searchMeal(e) {
    // call the api
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchBar.value}`, {mode: "cors"})
    .then(response => {
        // convert the response in JSON
        return response.json();
    })
    .then(data => {
        // pass the json data to the function which create the search card and append to the ul
        createSearchItem(data.meals);
    })
    .catch((err) => console.log(err));
    
}

function createSearchItem(data){
    // delete all the previous search result
    removePrevious();
    if (data) {
        // loop through the data array
        for(let i of data){
            // creating the div
            const div = document.createElement("div");
            div.classList.add("item");

            const imgDiv = document.createElement("div");
            imgDiv.classList.add("item-img");
            const imgTag = document.createElement("img");
            imgTag.src = i.strMealThumb;
            imgTag.alt = "Meal image"
            imgDiv.appendChild(imgTag);
            div.appendChild(imgDiv);

            const aTag = document.createElement("a");
            aTag.innerText = i.strMeal;
            aTag.href = "knowMore.html";
            aTag.target = "_blank";
            aTag.setAttribute("meal-id", i.idMeal);
            aTag.onclick = displayDetails(aTag);
            div.appendChild(aTag);

            const favButton = document.createElement("button");
            if (isPresentInFav(i.idMeal)) {
                favButton.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
                favButton.classList.add("remove-btn");
            } else {
                favButton.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
                favButton.classList.add("add-btn");
            }
            div.appendChild(favButton);
            
            searchItems.appendChild(div);
        }
    }
}

function displayDetails(data){
    localStorage.setItem("clickedId", data.getAttribute("meal-id"));
}

function removePrevious(){
    while (searchItems.firstChild) {
        searchItems.removeChild(searchItems.firstChild);
    }
}


function addFavList(e){
    let targetElement = e.target;

    if(targetElement.href){

        displayDetails(targetElement);

    }else if(targetElement.classList[0] == "add-btn"){
        // add this meals to the fav list
        const item = targetElement.parentElement;
        let mealName = item.childNodes[1].innerText;
        let mealId = item.childNodes[1].getAttribute("meal-id");

        saveLocal({mealName: mealName, mealId: mealId});

        targetElement.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";

        targetElement.classList.remove("add-btn");
        targetElement.classList.add("remove-btn");
    }else if(targetElement.classList[0] == "remove-btn"){
        // remove from the local storage
        const item = targetElement.parentElement;
        let mealId = item.childNodes[1].getAttribute("meal-id");

        removeFromLocal(mealId);

        targetElement.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
        targetElement.classList.remove("remove-btn");
        targetElement.classList.add("add-btn");
    }

}

function saveLocal(meal){
    let meals;
    if(localStorage.getItem("meals") == null){
        meals = [];
    }else{
        meals = JSON.parse(localStorage.getItem("meals"));
    }

    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
}


function removeFromLocal(mealId){
    let meals;
    if (localStorage.getItem("meals") == null) {
        meals = [];
    } else {
        meals = JSON.parse(localStorage.getItem("meals"));
    }

    const mealIndex = meals.findIndex(o => o.mealId === mealId);
    meals.splice(mealIndex, 1);
    if (meals.length > 0) {
        localStorage.setItem("meals", JSON.stringify(meals));
    } else {
        localStorage.removeItem("meals");
    }

}

function isPresentInFav(id) {
    let meals;
    if (localStorage.getItem("meals") == null) {
        meals = [];
    } else {
        meals = JSON.parse(localStorage.getItem("meals"));
    }

    const idx = meals.findIndex(o => o.mealId === id);
    return idx != -1 ? true : false;
}