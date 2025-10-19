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
    sessionDisplay.innerHTML = `<p>Session Data: Last viewed quote was: "${quoteText.substring(0, 30)}..."</p>`;
}

// --- DOM MANIPULATION FUNCTIONS (Modified for filtering) ---

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const filterSelect = document.getElementById('quoteCategoryFilter');


/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
function populateCategoryFilter() {
    // 1. Get all unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // 2. Clear previous options and add the default "All" option
    filterSelect.innerHTML = '<option value="all">All Categories</option>';

    // 3. Add category options
    categories.forEach(category => {
        if (category) { // Ensure category is not empty
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterSelect.appendChild(option);
        }
    });
}


/**
 * Filters and displays quotes based on the selected category. (Task 2 Core)
 */
function filterQuotes() {
    const selectedCategory = filterSelect.value;
    
    if (selectedCategory === 'all') {
        // If "All Categories" is selected, just show a random quote from the whole list
        showRandomQuote();
        return;
    }

    // Filter the quotes array
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the '${selectedCategory}' category.</p>`;
        return;
    }

    // Pick a random quote from the filtered list for display
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = ''; 

    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${quote.text}"`;
    
    const categorySpan = document.createElement('small');
    categorySpan.textContent = `— Category: ${quote.category} (Filtered Result)`;
    
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(categorySpan);
    
    // Save to session storage, though this is a filtered view
    saveLastViewedQuote(quote);
}


function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

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
    // ... (This function remains unchanged from the previous task) ...
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
    textInput.addEventListener('keypress', (e) => { // Optional: Improve UX
        if (e.key === 'Enter') {
            document.getElementById('newQuoteCategory').focus();
        }
    });
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

    // Save to Local Storage and update filter options
    saveQuotes();
    populateCategoryFilter(); // IMPORTANT: Update filter after adding new category

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    showRandomQuote(); 
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
            populateCategoryFilter(); // IMPORTANT: Update filter after importing
            showRandomQuote();
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
    showRandomQuote();
    createAddQuoteForm(); 
    populateCategoryFilter(); // NEW: Populate the filter dropdown on load
    
    // 3. Attach event listeners
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
});

// Event listener for the 'Show New Quote' button (Remains the same)
newQuoteButton.addEventListener('click', showRandomQuote);