// Open the sidebar
function openNav() 
{
    document.getElementById("mySidenav").style.width = "500px";
    document.getElementById("main-body").style.marginRight = "500px";
}
  
// Close the sidebar
function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main-body").style.marginRight = "0";
} 

// Create the Favorites meal array if it doesn't exist in local storage
if (localStorage.getItem("favouritesList") == null)
{
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Global variables
const mealList = document.getElementById('meal');
const mealDetailsContent = document.getElementById('meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
 
// Event Listener for closing recipe details page
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Fetch meal details from the mealdb API
async function fetchMealDetailsFromApi(url, inputValue) {
    const response = await fetch(`${url+inputValue}`);
    const meals = await response.json();
    return meals;
}

// Show meal list that matches the mealdb API
function showMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // Calling fetchMealDetailsFromApi function
    let meals = fetchMealDetailsFromApi(url, searchInputTxt); 

    meals.then(data => {
        let html = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                let isFav = arr.includes(meal.idMeal);
                
                // If the food is present in favorites list, set the favorite button as active
                let favBtnClass = isFav ? "like-btn active-color" : "like-btn";

                html += `
                <div class="meal-item">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt=".........">
                    </div>
                
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                        <button id="main${meal.idMeal}" class="${favBtnClass}" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                    </div>
                </div>`;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "Sorry, We Didn't Find Any Meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}

// Show meal details function
function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    
    // Calling fetchMealDetailsFromApi function
    let details = fetchMealDetailsFromApi(url, id);

    details.then(data => mealRecipeDetails(data.meals));
}

// Meal recipe details function
function mealRecipeDetails(meal) {
    meal = meal[0];

    let html = `
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">Recipe Category: ${meal.strCategory}</p>
           
            <div class="recipe-instruction">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>

            <!-- Add more recipe details here if needed -->
            `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Add and remove food from the favorite list
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = arr.includes(id);
    
    if (contain) {
        let index = arr.indexOf(id);
        arr.splice(index, 1);
        alert("Your Meal has been removed from your Favorites list.");
    } else {
        arr.push(id);
        alert("Your Meal has been added to your Favorites list.");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}
 
// Show the favorite meal list
function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const favBody = document.getElementById("favourites-body");
    let html = "";

    // If no food available in favorites list
    if (arr.length == 0) {
        html += `
            <div class="error-container">
                
                <div class="mb-4 lead">
                No favorite meals added yet..
                </div>
            </div>
            `;
        favBody.innerHTML = html;
    } else {
        for (let index = 0; index < arr.length; index++) {
            // Calling async function
            let favMeal = fetchMealDetailsFromApi(url, arr[index]);
            favMeal.then(data => {
                let meal = data.meals[0];
                html += `
                    <div class="fav-meal-item">
                        <div class="fav-meal-img">
                            <img src="${meal.strMealThumb}" alt=".........">
                        </div>
                    
                        <div class="fav-meal-name-details">
                            <h3>${meal.strMeal}</h3>
                            <button id="main${meal.idMeal}" class="recipe-btn" onclick="showMealDetails(${meal.idMeal})">More Details...</button>
                            <button id="main${meal.idMeal}" class="like-btn active-color" onclick="addRemoveToFavList(${meal.idMeal})"><i class="fas fa-duotone fa-heart"></i></button>
                        </div>
                    </div>
                `;
                favBody.innerHTML = html;
            });   
        }
    }
   
}
