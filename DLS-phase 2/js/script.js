// Application State (Source of Truth)
let lootArray = [];

// DOM Elements
let partySizeInput = document.getElementById("partySize");
let lootNameInput = document.getElementById("lootName");
let lootValueInput = document.getElementById("lootValue");
let quantityInput = document.getElementById("quantity");

let addLootBtn = document.getElementById("addLootBtn");
let splitBtn = document.getElementById("splitBtn");

let partyError = document.getElementById("partyError");
let lootError = document.getElementById("lootError");

let totalLootDisplay = document.getElementById("totalLoot");
let finalTotalDisplay = document.getElementById("finalTotal");
let perMemberDisplay = document.getElementById("perMember");

let noLootMessage = document.getElementById("noLootMessage");
let lootRows = document.getElementById("lootRows");

let resultsSection = document.getElementById("resultsSection");
let lootTotals = document.getElementById("lootTotals");

// Event Listeners
addLootBtn.addEventListener("click", addLoot);

splitBtn.addEventListener("click", function () {
    updateUI();
});

partySizeInput.addEventListener("input", updateUI);

// Add Loot Function
function addLoot() {

    let name = lootNameInput.value.trim();
    let value = parseFloat(lootValueInput.value);
    let quantity = parseInt(quantityInput.value);

    lootError.textContent = "";

    // Validation
    if (name === "") {
        lootError.textContent = "Loot name cannot be empty.";
        return;
    }

    if (isNaN(value) || value < 0) {
        lootError.textContent = "Loot value must be 0 or greater.";
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        lootError.textContent = "Quantity must be at least 1.";
        return;
    }

    // Add object to array
    lootArray.push({
        name: name,
        value: value,
        quantity: quantity
    });

    // Clear form
    lootNameInput.value = "";
    lootValueInput.value = "";
    quantityInput.value = "";

    updateUI();
}

// Remove Loot Function
function removeLoot(index) {

    lootArray.splice(index, 1);

    updateUI();
}

// Update UI (ALL calculations and rendering happen here)
function updateUI() {

    partyError.textContent = "";

    let partySize = parseInt(partySizeInput.value);

    // Calculate Total Loot
    let total = 0;

    for (let i = 0; i < lootArray.length; i++) {

        total += lootArray[i].value * lootArray[i].quantity;
    }

    // Render Loot List
    lootRows.innerHTML = "";

    for (let i = 0; i < lootArray.length; i++) {

        let row = document.createElement("div");
        row.className = "loot-row";

        let nameCell = document.createElement("div");
        nameCell.className = "loot-cell";
        nameCell.textContent = lootArray[i].name;

        let valueCell = document.createElement("div");
        valueCell.className = "loot-cell";
        valueCell.textContent = "$" + lootArray[i].value.toFixed(2);

        let quantityCell = document.createElement("div");
        quantityCell.className = "loot-cell";
        quantityCell.textContent = lootArray[i].quantity;

        let actionCell = document.createElement("div");
        actionCell.className = "loot-cell";

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";

        removeBtn.addEventListener("click", function () {
            removeLoot(i);
        });

        actionCell.appendChild(removeBtn);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);

        lootRows.appendChild(row);
    }

    // Empty State
    if (lootArray.length === 0) {

        noLootMessage.classList.remove("hidden");

        lootTotals.classList.add("hidden");

        resultsSection.classList.add("hidden");

        splitBtn.disabled = true;

        totalLootDisplay.textContent = "0.00";
        finalTotalDisplay.textContent = "0.00";
        perMemberDisplay.textContent = "0.00";

        return;
    }

    noLootMessage.classList.add("hidden");

    totalLootDisplay.textContent = total.toFixed(2);

    // Validate Party Size
    if (isNaN(partySize) || partySize < 1) {

        partyError.textContent = "Party size must be at least 1.";

        splitBtn.disabled = true;

        lootTotals.classList.remove("hidden");

        resultsSection.classList.add("hidden");

        return;
    }

    // Calculate Split
    let perMember = total / partySize;

    finalTotalDisplay.textContent = total.toFixed(2);
    perMemberDisplay.textContent = perMember.toFixed(2);

    // Show Results
    lootTotals.classList.remove("hidden");
    resultsSection.classList.remove("hidden");

    // Enable Split Button
    splitBtn.disabled = false;
}

// Initial UI Render
updateUI();