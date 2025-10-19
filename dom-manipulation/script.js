// Global array for quotes.
let quotes = [];

// --- UTILITY FUNCTIONS FOR WEB STORAGE AND DATA HANDLING (Task 1 & 3) ---

/**
 * Saves the current 'quotes' array to Local Storage.
 */
function saveQuotes() {
    localStorage.setItem('storedQuotes', JSON.stringify(quotes));
}

/**
 * Loads the 'quotes' array from Local Storage and initializes defaults or server data.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem('storedQuotes');
    
    // Check if there is server data to initialize from (Simulated)
    const serverQuotes = localStorage.getItem('serverQuotes');
    
    if (storedQuotes) {
        // Load quotes from Local Storage (Client's current state)
        quotes = JSON.parse(storedQuotes);
    } else if (serverQuotes) {
        // If client storage is empty, initialize from simulated server data
        quotes = JSON.parse(serverQuotes);
        saveQuotes(); // Save to local storage for the first time
    } else {
        // Use default initial quotes if both Local Storage and server are empty
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
            { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Life" },
        ];
        // For the first time, save this as both client and server state
        saveQuotes();
        localStorage.setItem('serverQuotes', JSON.stringify(quotes));
    }
}

/**
 * Saves the last viewed quote to Session Storage.
 */
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    displaySessionData();
}

/**
 * Displays the session storage data in the DOM.
 */
function displaySessionData() {
    const sessionDisplay = document.getElementById('sessionDisplay');
    const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
    const lastQuote = storedLastQuote ? JSON.parse(storedLastQuote) : { text: "None" };
    
    sessionDisplay.innerHTML = `<p>Session Data: Last viewed quote was: "${lastQuote.text.substring(0, Math.min(lastQuote.text.length, 30))}..."</p>`;
}


// --- SYNCHRONIZATION FUNCTIONS (Task 3 Core) ---

/**
 * Simulates an external update to the "server" database by adding a quote only there.
 */
function simulateServerUpdate() {
    let serverQuotes = JSON.parse(localStorage.getItem('serverQuotes') || '[]');
    
    // Add a new quote only to the "server"
    const newServerQuote = { 
        text: "The future belongs to those who believe in the beauty of their dreams.", 
        category: "Server Update" 
    };
    serverQuotes.push(newServerQuote);
    
    // Store back to local storage as the new server state
    localStorage.setItem('serverQuotes', JSON.stringify(serverQuotes));

    updateSyncStatus("Server updated externally. A sync is needed!", 'alert');
}

/**
 * Syncs local quotes with simulated server quotes and handles conflicts.
 */
function syncQuotes() {
    const serverQuotesString = localStorage.getItem('serverQuotes');
    const localQuotesString = localStorage.getItem('storedQuotes');
    
    if (serverQuotesString === localQuotesString) {
        // No difference - Fast-forward
        updateSyncStatus("Synchronization complete. Data is already synchronized.", 'ok');
        return;
    }

    const serverQuotes = JSON.parse(serverQuotesString || '[]');
    const localQuotes = JSON.parse(localQuotesString || '[]');
    
    // Simple Conflict Resolution: Find server quotes not present locally
    const newServerQuotes = serverQuotes.filter(sQuote => 
        !localQuotes.some(lQuote => lQuote.text === sQuote.text)
    );

    if (newServerQuotes.length > 0) {
        // Conflict detected: Server has new data
        quotes.push(...newServerQuotes); // Merge server data into client
        saveQuotes(); // Save the merged result locally
        
        updateSyncStatus(`Synchronization successful: Merged ${newServerQuotes.length} new quotes from the server.`, 'alert');
        
        // After merging, update the server to reflect the client's new, complete state
        localStorage.setItem('serverQuotes', JSON.stringify(quotes));

        // Refresh UI elements
        populateCategories();
        filterQuotes();
    } else if (localQuotes.length > serverQuotes.length) {
        // Client has new data not on server (i.e., new quotes added locally)
        localStorage.setItem('serverQuotes', JSON.stringify(localQuotes));
        updateSyncStatus("Synchronization successful: Uploaded local changes to server.", 'ok');
    } else {
        updateSyncStatus("Synchronization complete. No new unique changes found.", 'ok');
    }
}

/**
 * Updates the status message in the sync section.
 */
function updateSyncStatus(message, type) {
    const syncStatusDiv = document.getElementById('syncStatus');
    syncStatusDiv.textContent = `Status: ${message}`;
    syncStatusDiv.className = `status-message status-${type}`;
}

// --- DOM MANIPULATION FUNCTIONS (Task 0 & 2) ---

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');

// Correctly referencing the filter element ID
const filterSelect = document.getElementById('categoryFilter');


/**
 * Populates the category filter dropdown with unique categories.
 * REQUIRED NAME: populateCategories
 */
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    filterSelect.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        if (category) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterSelect.appendChild(option);
        }
    });
}


/**
 * Filters and displays quotes based on the selected category, and saves the filter state.
 * REQUIRED NAME: filterQuotes
 */
function filterQuotes() {
    const selectedCategory = filterSelect.value;
    
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    if (selectedCategory === 'all') {
        showRandomQuote(quotes); 
        return;
    }

    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the '${selectedCategory}' category.</p>`;
        return;
    }

    showRandomQuote(filteredQuotes);
}


/**
 * Displays a random quote from a given array.
 */
function showRandomQuote(arrayToUse = quotes) {
    if (arrayToUse.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * arrayToUse.length);
    const quote = arrayToUse[randomIndex];

    quoteDisplay.innerHTML = ''; 

    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${quote.text}"`;
    
    const categorySpan = document.createElement('small');
    categorySpan.textContent = `— Category: ${quote.category}`;
    
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(categorySpan);

    saveLastViewedQuote(quote);
}


/**
 * Dynamically creates the 'Add New Quote' form.
 * REQUIRED NAME: createAddQuoteForm
 */
function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.id = 'addQuoteForm';
    
    const title = document.createElement('h2');
    title.textContent = 'Add New Quote';

    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formDiv.appendChild(title);
    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
    
    formContainer.appendChild(formDiv);
}

/**
 * Handles adding a new quote.
 */
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { 
        text: newQuoteText, 
        category: newQuoteCategory 
    };
    quotes.push(newQuote);

    saveQuotes();
    populateCategories(); 

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    filterQuotes(); 
    updateSyncStatus("Local changes detected. Sync to push them to the server.", 'alert');
}


// --- JSON IMPORT/EXPORT FUNCTIONS (Task 1) ---

function exportToJsonFile() {
    const jsonString = JSON.stringify(quotes, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories(); 
            filterQuotes(); 
            updateSyncStatus("Local changes detected from import. Sync to update server.", 'alert');
            alert(`Quotes imported successfully! Total quotes: ${quotes.length}`);
        } catch (e) {
            alert('Error importing file: The file must be a valid JSON format.');
            console.error(e);
        }
    };
    
    fileReader.readAsText(event.target.files[0]);
}


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load quotes from Local Storage (or simulated server)
    loadQuotes(); 
    
    // 2. Initialize UI elements
    createAddQuoteForm(); 
    populateCategories(); 
    
    // 3. Load and restore last selected filter
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
        filterSelect.value = lastFilter;
    }
    
    // 4. Apply the filter (or show random quote if "all" is selected)
    filterQuotes(); 
    
    // 5. Attach ALL event listeners
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    document.getElementById('newQuote').addEventListener('click', () => showRandomQuote(quotes));
    
    // Task 3: Sync buttons
    document.getElementById('syncButton').addEventListener('click', syncQuotes);
    document.getElementById('simulateConflict').addEventListener('click', simulateServerUpdate);
});