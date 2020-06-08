let searchBar = document.forms["search-form"];
let searchField = searchBar.elements["search-bar"];
let allRecipes = document.querySelectorAll(".recipe-preview-card");

searchBar.addEventListener("keyup", (event) => {

  let searchValue = searchField.value.toLowerCase();
  for (let recipe of allRecipes) {
    // get title of the recipe
    let recipeTitle = recipe.querySelector(".recipe-title").innerHTML.toLowerCase();

    // if recipe title does not include search then hide it
    if (!recipeTitle.includes(searchValue)) {
      recipe.style.display = "none";
    } else {
      recipe.style.display = "";
    }
  }

})