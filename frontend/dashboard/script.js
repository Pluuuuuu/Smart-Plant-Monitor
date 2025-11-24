//wait for the page to finish loading HTML
document.addEventListener("DOMContentLoaded", () => {
  //// Initialize dashboard (async) and catch errors
  initDashboard().catch((err) => console.error(err));
});

let dashboardData = [];
let statusFilterEl = null;
let searchInputEl = null;

function statusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "ok":
      return "spm-status-ok";
    case "needs_water":
    case "needs water":
      return "spm-status-needs";
    case "overwatered":
      return "spm-status-over";
    default:
      return "spm-status-nodata"; //no reading or unknown status
  }
}

//main dashoard function
async function initDashboard() {
  //get filter + search elements
  statusFilterEl = document.getElementById("status-filter");
  searchInputEl = document.getElementById("search-input");

  dashboardData = await apiGet("/dashboard");

  renderStats(dashboardData);
  renderTable(dashboardData, "", "all");

  // Update table when filter changes
  statusFilterEl.addEventListener("change", () => {
    renderTable(dashboardData, searchInputEl.value, statusFilterEl.value);
  });
  // Update table when user types
  searchInputEl.addEventListener("input", () => {
    renderTable(dashboardData, searchInputEl.value, statusFilterEl.value);
  });
}

// Render the statistics summary
function renderStats(plants) {
  const total = plants.length;
  let needs = 0,
    over = 0,
    ok = 0,
    nodata = 0;

  plants.forEach((p) => {
    switch ((p.status || "").toLowerCase()) {
      case "ok":
        ok++;
        break;
      case "needs_water":
      case "needs water":
        needs++;
        break;
      case "overwatered":
        over++;
        break;
      default:
        nodata++;
    }
  });

  // display in UI
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-needs").textContent = needs;
  document.getElementById("stat-over").textContent = over;
  document.getElementById("stat-ok").textContent = ok;
  document.getElementById("stat-nodata").textContent = nodata;
}

function renderTable(plants, searchTerm, statusFilter) {
  const tbody = document.querySelector("#plants-table tbody");
  tbody.innerHTML = ""; //clear existing rows

  const term = (searchTerm || "").toLowerCase().trim();

  const filtered = plants.filter((p) => {
    const matchTerm =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.species.toLowerCase().includes(term);
    const matchStatus =
      statusFilter === "all" ||
      (p.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchTerm && matchStatus;
  });

  filtered.forEach((plant) => {
    const tr = document.createElement("tr"); //create empty row

    //fill row with plant data
    tr.innerHTML = `
      <td>
        <a href="../plant_form/plant_details.html?id=${plant.id}">
          ${plant.name}
        </a>
      </td>

      <td>${plant.species}</td>

      <td>${plant.ideal_moisture_min}% - ${plant.ideal_moisture_max}%</td>

      <td>
        ${
          plant.last_reading
            ? formatRelative(plant.last_reading.timestamp)
            : "Unknown"
        }
      </td>

      <td>
        <span class="spm-status-pill ${statusClass(plant.status)}">
          ${formatStatusLabel(plant.status)}
        </span>
      </td>

      <td class="spm-actions">

        <!-- View Details -->
        <span class="spm-link-icon"
          title="View details"
          onclick="location.href='../plant_form/plant_details.html?id=${plant.id}'">
          <img src="../assests/expand-content-svgrepo-com.svg" alt="View" width="20" height="20">
        </span>

        <!-- Edit Plant -->
        <span class="spm-link-icon"
          title="Edit plant"
          onclick="location.href='../plant_form/edit_plant.html?id=${plant.id}'">
          <img src="../assests/edit-3-svgrepo-com.svg" alt="View" width="20" height="20">
        </span>

        <!-- Add Reading -->
        <span class="spm-link-icon"
          title="Add moisture reading"
          onclick="location.href='../readings/add_reading.html?plant_id=${plant.id}'">
          <img src="../assests/add-square-svgrepo-com.svg" alt="View" width="20" height="20">
        </span>

        <!-- Delete Plant -->
        <span class="spm-link-icon"
          title="Delete plant"
          onclick="handleDeletePlant(${plant.id})">
          <img src="../assests/delete-2-svgrepo-com.svg" alt="Delete plant" width="20" height="20">
        </span>

      </td>
    `;

    tbody.appendChild(tr);
  });
}

function formatStatusLabel(status) {
  if (!status) return "No Data";
  switch (status.toLowerCase()) {
    case "needs_water":
      return "Needs Water";
    case "overwatered":
      return "Overwatered";
    case "ok":
      return "OK";
    default:
      return "No Data";
  }
}

async function handleDeletePlant(plantId) {
  if (!plantId) return;
  const confirmed = window.confirm(
    "Delete this plant? This removes the plant and all readings."
  );
  if (!confirmed) return;

  try {
    await apiDelete(`/plants/${plantId}`);
    dashboardData = dashboardData.filter((plant) => plant.id !== plantId);
    renderStats(dashboardData);
    renderTable(
      dashboardData,
      searchInputEl?.value || "",
      statusFilterEl?.value || "all"
    );
  } catch (err) {
    console.error(err);
    alert("Failed to delete plant. Please try again.");
  }
}
