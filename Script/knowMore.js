// get the id of the clicked meals
const id = localStorage.getItem("clickedId");
const mainDiv = document.getElementById("mainDiv");

// selectors
const imgContainer = document.querySelector(".img-container");
const detailsContainer = document.querySelector(".details-container");

function init() {
    // call the api
    let clickid = localStorage.getItem("clickedId");
    fetch(`https:www.themealdb.com/api/json/v1/1/lookup.php?i=${clickid}`)
    .then(response => {
        // convert the response in JSON
        return response.json();
    })
    .then(data => {
        // pass the json data to the function which create the search card and append to the ul
        showDetailsHero(data);
    })
    .catch(err => console.log(err));
}




function showDetailsHero(data){
    let d = data.meals;
    
    mainDiv.innerHTML = `
    <div id="imgDiv">
        <img id="thumbImg" src="${d[0].strMealThumb}" alt="">
    </div>

    <div id="infoDiv">
        <h2 id="name" class="div">Name : ${d[0].strMeal}</h2>
        <h3 id="category" class="div">Category : ${d[0].strCategory}</h3>
        <h3 id="area" class="div">Area : ${d[0].strArea}</h3>
        <p id="instructions" class="div"><b>Instructions :</b><br>${d[0].strInstructions}</p>
    </div>
    `
}




function btnFuntion(btn, hero){
    if(btn.classList[0] == "add-btn"){
        saveLocal({heroName: hero.name, heroId: hero.id})
        btn.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
        btn.classList.remove("add-btn");
        btn.classList.add("remove-btn");
    }else{
        removeFromLocal(id);
        btn.innerHTML = "<i class='far fa-heart'></i> Add Favourite";
        btn.classList.add("add-btn");
        btn.classList.remove("remove-btn");
    }
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

function saveLocal(hero) {
    let meals;
    if (localStorage.getItem("meals") == null) {
        meals = [];
    } else {
        meals = JSON.parse(localStorage.getItem("meals"));
    }

    meals.push(hero);
    localStorage.setItem("meals", JSON.stringify(meals));
}


window.addEventListener("load", init);
