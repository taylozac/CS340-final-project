const saveRecipeButton = document.querySelector("#recipe-save-button");

saveRecipeButton.addEventListener("click", async (event) => {
  const recipeId = saveRecipeButton.getAttribute("data-id");

  let response = await axios.post("/recipes/save", {
    recipeId,
  });

  if (response.data.wasSuccess) {
    alert("Recipe saved to My Recipes");
    window.location = "/recipes/user";
  } else {
    alert("unable to save recipe");
  }

});