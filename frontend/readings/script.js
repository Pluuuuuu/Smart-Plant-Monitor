document.addEventListener("DOMContentLoaded", () => {
  initAddReading();
});

// Initialize Add Reading form
async function initAddReading() {
  const form = document.getElementById("reading-form");
  const plantSelect = document.getElementById("plant-select");
  const params = new URLSearchParams(window.location.search);
  const plantIdParam = params.get("plant_id");

  // Load plants for dropdown
  try {
    const plants = await apiGet("/plants");
    plants.forEach((plant) => {
      const option = document.createElement("option");
      option.value = plant.id;
      option.textContent = `${plant.name} - ${plant.species || "Unknown"}`;
      plantSelect.appendChild(option);
    });

    // Pre-select plant if provided in URL
    if (plantIdParam) {
      plantSelect.value = plantIdParam;
    }
  } catch (err) {
    console.error("Error loading plants:", err);
    alert("Failed to load plants. Please refresh the page.");
    return;
  }

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const plantId = parseInt(plantSelect.value);
    const moisturePercent = parseFloat(document.getElementById("moisture-percent").value);

    // Validate
    if (!validateReadingForm(plantId, moisturePercent)) {
      return;
    }

    try {
      await apiPost("/readings", {
        plant_id: plantId,
        moisture_percent: moisturePercent,
      });

      // Redirect to plant details or dashboard
      if (plantIdParam) {
        window.location.href = `../plant_form/plant_details.html?id=${plantId}`;
      } else {
        window.location.href = "../dashboard/index.html";
      }
    } catch (err) {
      console.error("Error creating reading:", err);
      alert("Failed to save reading. Please try again.");
    }
  });
}

// Validate reading form
function validateReadingForm(plantId, moisturePercent) {
  let valid = true;

  const plantSelect = document.getElementById("plant-select");
  const moistureInput = document.getElementById("moisture-percent");
  const plantError = document.getElementById("plant-error");
  const moistureError = document.getElementById("moisture-error");

  // Clear previous errors
  plantError.textContent = "";
  moistureError.textContent = "";
  plantSelect.classList.remove("error");
  moistureInput.classList.remove("error");

  // Validate plant
  if (!plantId || isNaN(plantId)) {
    plantError.textContent = "Please select a plant.";
    plantSelect.classList.add("error");
    valid = false;
  }

  // Validate moisture
  if (isNaN(moisturePercent)) {
    moistureError.textContent = "Moisture percentage is required.";
    moistureInput.classList.add("error");
    valid = false;
  } else if (moisturePercent < 0) {
    moistureError.textContent = "Moisture percentage cannot be less than 0%.";
    moistureInput.classList.add("error");
    valid = false;
  } else if (moisturePercent > 100) {
    moistureError.textContent = "Moisture percentage cannot exceed 100%.";
    moistureInput.classList.add("error");
    valid = false;
  }

  return valid;
}

