const createRecipeForm = document.forms["new-recipe-form"];

// add submit event listener
createRecipeForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get author, title, and description  fields
  let title = createRecipeForm.elements["title"].value;
  let author = createRecipeForm.elements["author"].value;
  let description = createRecipeForm.elements["description"].value;

  // send author, title, and description to the server
  try {
    let response = await axios.post("/recipes/create", {
      title,
      author,
      description,
    });

    if (response.status === 200) {
      alert("Recipe Created!");
      createRecipeForm.reset();
    }
  } catch (err) {
    alert("Something went wrong! Make sure the author is an existing user!");
  }
});
