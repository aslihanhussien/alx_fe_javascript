// Global array for quotes.
let quotes = [];

// --- UTILITY FUNCTIONS FOR WEB STORAGE AND DATA HANDLING (Task 1) ---

function saveQuotes() {
    localStorage.setItem('storedQuotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('storedQuotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if local storage is empty
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Work" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
            { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Life" },
        ];
        saveQuotes(); 
    }
}

function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    displaySessionData(quote.text);
}

function displaySessionData(quoteText) {
    const sessionDisplay = document.getElementById('sessionDisplay');
    const storedLastQuote = sessionStorage.getItem('lastViewedQuote');
    const lastQuote = storedLastQuote ? JSON.parse(storedLastQuote) : { text: "None" };
    
    sessionDisplay.innerHTML = `<p>Session Data: Last viewed quote was: "${lastQuote.text.substring(0, Math.min(lastQuote.text.length, 30))}..."</p>`;
}


// --- DOM MANIPULATION FUNCTIONS ---

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const filterSelect = document.getElementById('quoteCategoryFilter');


/**
 * Populates the category filter dropdown with unique categories.
 * REQUIRED NAME: populateCategories
 */
function populateCategories() {
    // 1. Get all unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // 2. Clear previous options and add the default "All" option
    filterSelect.innerHTML = '<option value="all">All Categories</option>';

    // 3. Add category options
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
    
    // Step 2: Remember the Last Selected Filter in Local Storage
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    if (selectedCategory === 'all') {
        // If "All Categories" is selected, just show a random quote from the whole list
        showRandomQuote(quotes); // Pass the full array
        return;
    }

    // Filter the quotes array
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the '${selectedCategory}' category.</p>`;
        return;
    }

    // Pass the filtered list to the display function
    showRandomQuote(filteredQuotes);
}


/**
 * Displays a random quote from a given array (defaults to the full global 'quotes' array).
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


function createAddQuoteForm() {
    // ... (Function to dynamically create the form) ...
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

    // Step 3: Save to Local Storage and update filter options
    saveQuotes();
    populateCategories(); // Update filter after adding new category

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Apply the current filter (or show random if none set)
    filterQuotes(); 
    alert(`Quote added successfully! Total quotes: ${quotes.length}`);
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
            populateCategories(); // Update filter after importing
            filterQuotes(); // Apply the current filter
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
    // 1. Load quotes from Local Storage
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
    
    // 5. Attach event listeners
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    document.getElementById('newQuote').addEventListener('click', () => showRandomQuote(quotes)); // Use full list for New Quote button
});