const createRecipeForm = document.forms["new-recipe-form"];

// add submit event listener
createRecipeForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get author, title, and description  fields
  let title = createRecipeForm.elements["title"].value;
  let author = createRecipeForm.elements["author"].value;
  let description = createRecipeForm.elements["description"].value;

  // get all tools
  let toolsField = document.querySelector(".select-tools");
  let allTools = toolsField.querySelectorAll("input");
  let tools = [];
  for (tool of allTools) {
    if (tool.checked) {
      tools.push(tool.value);
    }
  }

  // get all ingredients
  let ingredientsField = document.querySelector(".select-ingredients");
  let allingredients = ingredientsField.querySelectorAll("input");
  let ingredients = [];
  for (ingredient of allingredients) {
    if (ingredient.checked) {
      ingredients.push(ingredient.value);
    }
  }


  try {
    let response = await axios.post("/recipes/create", {
      title,
      author,
      description,
      ingredients,
      tools,
    });

    if (response.status === 200) {
      alert("Recipe Created!");
      window.location = "/recipes";
    }
  } catch (err) {
    alert("Something went wrong! Make sure the author is an existing user!");
  }
});
