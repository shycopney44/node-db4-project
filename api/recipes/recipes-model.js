const db = require('../../data/db-config');

async function getRecipeById(recipe_id) {
  try {
    // Querying database for recipe details, steps, and ingredients
    const recipeRows = await db('recipes as r')
      .leftJoin('steps as s', 'r.recipe_id', 's.recipe_id')
      .leftJoin('step_ingredients as si', 's.step_id', 'si.step_id')
      .leftJoin('ingredients as i', 'si.ingredient_id', 'i.ingredient_id')
      .select(
        'r.recipe_id',
        'r.recipe_name',
        's.step_id',
        's.step_number',
        's.step_text',
        'si.ingredient_id',
        'i.ingredient_name',
        'si.quantity'
      )
      .orderBy('s.step_number')
      .where('r.recipe_id', recipe_id);

    // Structuring the data into nested format
    const recipe = {
      recipe_id: recipeRows[0]?.recipe_id, // Handle case where no rows are returned
      recipe_name: recipeRows[0]?.recipe_name,
      steps: recipeRows.reduce((acc, row) => {
        const existingStep = acc.find((step) => step.step_id === row.step_id);

        if (!existingStep) {
          // New step without ingredients or first time encountering step
          acc.push({
            step_id: row.step_id,
            step_number: row.step_number,
            step_text: row.step_text,
            ingredients: row.ingredient_id
              ? [
                  {
                    ingredient_id: row.ingredient_id,
                    ingredient_name: row.ingredient_name,
                    quantity: row.quantity,
                  },
                ]
              : [],
          });
        } else if (row.ingredient_id) {
          // Existing step with a new ingredient
          existingStep.ingredients.push({
            ingredient_id: row.ingredient_id,
            ingredient_name: row.ingredient_name,
            quantity: row.quantity,
          });
        }

        return acc;
      }, []),
    };

    return recipe;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error; // Re-throw error to the caller
  }
}

module.exports = { getRecipeById };
