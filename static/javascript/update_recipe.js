const updateRecipeForm = document.forms["update-recipe-form"];

// add submit event listener
updateRecipeForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent default form submission

  // get recipe id
  let r_id = updateRecipeForm.getAttribute("data-id");

  // get author, title, and description  fields
  let title = updateRecipeForm.elements["title"].value;
  let author = updateRecipeForm.elements["author"].value;
  let description = updateRecipeForm.elements["description"].value;

  // send author, title, and description to the server
  try {
    let response = await axios.put(`/recipes/update/${r_id}`, {
      title,
      author,
      description,
    });

    if (response.data.wasSuccess) {
      alert("Recipe Updated");
      window.location = "/recipes";
    } else {
      alert("unable to update the recipe");
    }
  } catch (err) {
    alert("Something went wrong! Make sure the author is an existing user!");
  }
});