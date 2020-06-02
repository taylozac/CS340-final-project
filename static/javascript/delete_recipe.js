const deleteRecipeButton = document.querySelector("button.delete-recipe");

deleteRecipeButton.addEventListener("click", async (event) => {
  const r_id = deleteRecipeButton.getAttribute("data-id");
  console.log("In browser:", r_id);
  
  let deleteConfirmed = confirm("Are you sure you'd like to delete this recipe?")
  
  if (deleteConfirmed) {
    let response = await axios.delete(`/recipes/delete/${r_id}`);

    if (response.data.wasSuccess) {
      alert("Recipe Deleted Successfully!");
      window.location = "/recipes";
    } else {
      alert("Unable to delete recipe");
    }
  }
});