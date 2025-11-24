document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("add_plant.html")) {
    initAddPlant();
  } else if (path.includes("edit_plant.html")) {
    initEditPlant();
  } else if (path.includes("plant_details.html")) {
    initPlantDetails();
  }
});

// Initialize Add Plant form
function initAddPlant() {
  const form = document.getElementById("plant-form");
  const minSlider = document.getElementById("moisture-min");
  const maxSlider = document.getElementById("moisture-max");
  const minValue = document.getElementById("min-value");
  const maxValue = document.getElementById("max-value");

  // Update slider displays
  minSlider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    minValue.textContent = `${value}%`;
    updateSliderTrack(minSlider, value);
    
    // Ensure max is >= min
    if (parseInt(maxSlider.value) < value) {
      maxSlider.value = value;
      maxValue.textContent = `${value}%`;
      updateSliderTrack(maxSlider, value);
    }
  });

  maxSlider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    maxValue.textContent = `${value}%`;
    updateSliderTrack(maxSlider, value);
    
    // Ensure max is >= min
    if (value < parseInt(minSlider.value)) {
      minSlider.value = value;
      minValue.textContent = `${value}%`;
      updateSliderTrack(minSlider, value);
    }
  });

  // Initialize slider tracks
  updateSliderTrack(minSlider, parseInt(minSlider.value));
  updateSliderTrack(maxSlider, parseInt(maxSlider.value));

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const species = document.getElementById("species").value.trim();
    const min = parseInt(minSlider.value);
    const max = parseInt(maxSlider.value);

    // Validate
    if (!validatePlantForm(name, min, max)) {
      return;
    }

    try {
      await apiPost("/plants", {
        name,
        species: species || "Unknown",
        ideal_moisture_min: min,
        ideal_moisture_max: max,
      });
      window.location.href = "../dashboard/index.html";
    } catch (err) {
      console.error("Error creating plant:", err);
      alert("Failed to create plant. Please try again.");
    }
  });
}

// Initialize Edit Plant form
async function initEditPlant() {
  const params = new URLSearchParams(window.location.search);
  const plantId = params.get("id");

  if (!plantId) {
    alert("Missing plant ID.");
    window.location.href = "../dashboard/index.html";
    return;
  }

  // Load plant data
  let plant;
  try {
    plant = await apiGet(`/plants/${plantId}`);
  } catch (err) {
    alert("Could not load plant.");
    console.error(err);
    window.location.href = "../dashboard/index.html";
    return;
  }

  // Pre-fill form
  document.getElementById("name").value = plant.name;
  document.getElementById("species").value = plant.species || "";
  const minSlider = document.getElementById("moisture-min");
  const maxSlider = document.getElementById("moisture-max");
  minSlider.value = plant.ideal_moisture_min;
  maxSlider.value = plant.ideal_moisture_max;

  const minValue = document.getElementById("min-value");
  const maxValue = document.getElementById("max-value");
  minValue.textContent = `${plant.ideal_moisture_min}%`;
  maxValue.textContent = `${plant.ideal_moisture_max}%`;

  // Update slider tracks
  updateSliderTrack(minSlider, plant.ideal_moisture_min);
  updateSliderTrack(maxSlider, plant.ideal_moisture_max);

  // Update last updated (if available)
  const lastUpdatedEl = document.getElementById("last-updated");
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = `Last Updated: ${new Date().toLocaleString()}`;
  }

  // Slider event listeners
  minSlider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    minValue.textContent = `${value}%`;
    updateSliderTrack(minSlider, value);
    
    if (parseInt(maxSlider.value) < value) {
      maxSlider.value = value;
      maxValue.textContent = `${value}%`;
      updateSliderTrack(maxSlider, value);
    }
  });

  maxSlider.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    maxValue.textContent = `${value}%`;
    updateSliderTrack(maxSlider, value);
    
    if (value < parseInt(minSlider.value)) {
      minSlider.value = value;
      minValue.textContent = `${value}%`;
      updateSliderTrack(minSlider, value);
    }
  });

  // Form submission
  const form = document.getElementById("plant-edit-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const species = document.getElementById("species").value.trim();
    const min = parseInt(minSlider.value);
    const max = parseInt(maxSlider.value);

    // Validate
    if (!validatePlantForm(name, min, max)) {
      return;
    }

    try {
      await apiPut(`/plants/${plantId}`, {
        name,
        species: species || "Unknown",
        ideal_moisture_min: min,
        ideal_moisture_max: max,
      });
      window.location.href = "../dashboard/index.html";
    } catch (err) {
      console.error("Error updating plant:", err);
      alert("Failed to update plant. Please try again.");
    }
  });
}

// Validate plant form
function validatePlantForm(name, min, max) {
  let valid = true;

  const nameInput = document.getElementById("name");
  const minInput = document.getElementById("moisture-min");
  const maxInput = document.getElementById("moisture-max");
  const nameError = document.getElementById("name-error");
  const minError = document.getElementById("min-error");
  const maxError = document.getElementById("max-error");

  // Clear previous errors
  nameError.textContent = "";
  minError.textContent = "";
  maxError.textContent = "";
  nameInput.classList.remove("error");
  minInput.classList.remove("error");
  maxInput.classList.remove("error");

  // Validate name
  if (!name || name.length < 3) {
    nameError.textContent = "Plant name must be at least 3 characters long.";
    nameInput.classList.add("error");
    valid = false;
  }

  // Validate minimum
  if (min < 0) {
    minError.textContent = "Minimum moisture cannot be less than 0%.";
    minInput.classList.add("error");
    valid = false;
  } else if (min > 100) {
    minError.textContent = "Minimum moisture cannot exceed 100%.";
    minInput.classList.add("error");
    valid = false;
  }

  // Validate maximum
  if (max < 0) {
    maxError.textContent = "Maximum moisture cannot be less than 0%.";
    maxInput.classList.add("error");
    valid = false;
  } else if (max > 100) {
    maxError.textContent = "Maximum moisture cannot exceed 100%.";
    maxInput.classList.add("error");
    valid = false;
  } else if (max < min) {
    maxError.textContent = "Maximum moisture must be greater than or equal to minimum.";
    maxInput.classList.add("error");
    valid = false;
  }

  return valid;
}

// Update slider track color
function updateSliderTrack(slider, value) {
  const percentage = (value / 100) * 100;
  slider.style.setProperty("--value", `${percentage}%`);
}

// Get status class
function getStatusClass(status) {
  if (!status) return "spm-status-nodata";
  switch (status.toLowerCase()) {
    case "ok":
      return "spm-status-ok";
    case "needs_water":
      return "spm-status-needs";
    case "overwatered":
      return "spm-status-over";
    case "no_data":
    default:
      return "spm-status-nodata";
  }
}

// Format status label
function formatStatusLabel(status) {
  if (!status) return "No Data";
  switch (status.toLowerCase()) {
    case "needs_water":
      return "Needs Water";
    case "overwatered":
      return "Overwatered";
    case "ok":
      return "OK";
    case "no_data":
    default:
      return "No Data";
  }
}

// Compute status from moisture reading
function computeStatus(idealMin, idealMax, latestReading) {
  if (latestReading === null || latestReading === undefined) {
    return "no_data";
  }
  if (latestReading < idealMin) {
    return "needs_water";
  }
  if (latestReading > idealMax) {
    return "overwatered";
  }
  return "ok";
}

// Initialize Plant Details page
async function initPlantDetails() {
  const params = new URLSearchParams(window.location.search);
  const plantId = params.get("id");

  if (!plantId) {
    alert("Missing plant ID");
    window.location.href = "../dashboard/index.html";
    return;
  }

  // Load plant data
  let plant;
  try {
    plant = await apiGet(`/plants/${plantId}`);
  } catch (err) {
    alert("Failed to load plant details.");
    console.error(err);
    window.location.href = "../dashboard/index.html";
    return;
  }

  // Load readings
  let readings = [];
  try {
    readings = await apiGet(`/readings/${plantId}`);
    // Sort by timestamp descending
    readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (err) {
    // Try alternative endpoint
    try {
      readings = await apiGet(`/plants/${plantId}/readings`);
      readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (err2) {
      console.warn("Could not load readings:", err2);
    }
  }

  // Get latest reading
  const latestReading = readings.length > 0 ? readings[0] : null;
  const latestValue = latestReading ? latestReading.moisture_percent : null;

  // Compute status
  const status = computeStatus(
    plant.ideal_moisture_min,
    plant.ideal_moisture_max,
    latestValue
  );

  // Update page content
  document.getElementById("plant-name").textContent = plant.name;
  document.getElementById("plant-name-header").textContent = plant.name;
  document.getElementById("plant-species").textContent =
    plant.species || "Unknown species";

  const statusPill = document.getElementById("plant-status-pill");
  statusPill.className = `spm-status-pill ${getStatusClass(status)}`;
  statusPill.textContent = formatStatusLabel(status);

  const idealRange = `${plant.ideal_moisture_min}% - ${plant.ideal_moisture_max}%`;
  document.getElementById("ideal-range").textContent = idealRange;
  document.getElementById("ideal-range-label").textContent = `Ideal: ${idealRange}`;

  if (latestReading) {
    document.getElementById("last-moisture-value").textContent = `${latestValue}%`;
    document.getElementById("last-moisture-time").textContent = formatDateTime(
      latestReading.timestamp
    );
    document.getElementById("last-reading-short").textContent =
      `Last reading: ${formatRelative(latestReading.timestamp)}`;
  } else {
    document.getElementById("last-moisture-value").textContent = "–";
    document.getElementById("last-moisture-time").textContent = "–";
    document.getElementById("last-reading-short").textContent = "Last reading: –";
  }

  // Setup button actions
  document.getElementById("btn-log-reading").addEventListener("click", () => {
    window.location.href = `../readings/add_reading.html?plant_id=${plantId}`;
  });

  document.getElementById("btn-edit-plant").addEventListener("click", () => {
    window.location.href = `edit_plant.html?id=${plantId}`;
  });

  // Render readings history
  renderReadingsHistory(readings, plant.ideal_moisture_min, plant.ideal_moisture_max);
}

// Render readings history table
function renderReadingsHistory(readings, idealMin, idealMax) {
  const tbody = document.getElementById("readings-tbody");
  tbody.innerHTML = "";

  if (!readings || readings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--color-text-muted);">No readings yet.</td></tr>`;
    return;
  }

  readings.forEach((reading) => {
    const tr = document.createElement("tr");
    const status = computeStatus(idealMin, idealMax, reading.moisture_percent);
    const statusClass = getStatusClass(status);
    const statusLabel = formatStatusLabel(status);

    tr.innerHTML = `
      <td>${reading.moisture_percent}%</td>
      <td>
        <span class="spm-status-pill ${statusClass}">${statusLabel}</span>
      </td>
      <td>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span>🕐</span>
          <span>${formatDateTime(reading.timestamp)}</span>
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

