// selectors
const favList = document.querySelector(".fav-list");
const button = document.getElementsByTagName("button");


// fetch all the meals from the local storage
function fetchFromLocal(){
    if(localStorage.getItem("meals") != null){

        let meals = JSON.parse(localStorage.getItem("meals"));
        meals.forEach(element => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${element.mealId}`)
                .then(response => {
                    // convert the response in JSON
                    return response.json();
                })
                .then(data => {
                    // pass the json data to the function which create the search card and append to the ul
                    displayFavList(data.meals[0].strMealThumb, element.mealName, element.mealId);
                });
        });

    }else{
        const h1 = document.createElement("h1");
        h1.innerText = "Add Your Fav Meal :)";
        favList.appendChild(h1);
    }
}



// display all the meals from the fav list
function displayFavList(imgUrl, mealName, mealId){
    const div = document.createElement("div");
    div.classList.add("item");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("hero-img");
    div.appendChild(imgDiv);

    const img = document.createElement("img");
    img.src = imgUrl;
    imgDiv.appendChild(img);

    const p = document.createElement("p");
    p.innerText = mealName;
    div.appendChild(p);

    const favButton = document.createElement("button");
    favButton.innerHTML = "<i class='far fa-heart'></i> Remove Favourite";
    favButton.classList.add("remove-btn");
    favButton.setAttribute("meal-id", mealId);
    div.appendChild(favButton);
    // removing this item if this button get clicked
    favButton.addEventListener("click", function () {
        const parentElement = this.parentElement;
        parentElement.remove();
        let mealId = this.getAttribute("meal-id");
        removeFromLocal(mealId);
    });

    favList.appendChild(div);
}

// removing the meals from local storage
function removeFromLocal(mealId){
    let meals = JSON.parse(localStorage.getItem("meals"));
    const mealIndex = meals.findIndex(o => o.mealId === mealId);
    meals.splice(mealIndex, 1);
    if(meals.length > 0){
        localStorage.setItem("meals", JSON.stringify(meals));
    }else{
        localStorage.removeItem("meals");
        const h1 = document.createElement("h1");
        h1.innerText = "Add Your Fav Meal :)";
        favList.appendChild(h1);
    }
}



window.addEventListener("load", fetchFromLocal);