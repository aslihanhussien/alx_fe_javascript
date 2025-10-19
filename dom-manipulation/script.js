// Initial Quotes Array
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Life" },
];

// Reference to static DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');

/**
 * Displays a random quote from the 'quotes' array in the DOM.
 * Uses advanced DOM manipulation to create elements.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        return;
    }
    
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear previous content
    quoteDisplay.innerHTML = ''; 

    // Create and append quote elements dynamically
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${quote.text}"`;
    
    const categorySpan = document.createElement('small');
    categorySpan.textContent = `— Category: ${quote.category}`;
    
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(categorySpan);
}

/**
 * Dynamically creates and injects the 'Add New Quote' form into the DOM.
 * Fulfills the 'createAddQuoteForm' requirement from Task 0.
 */
function createAddQuoteForm() {
    // 1. Create container and title
    const formDiv = document.createElement('div');
    formDiv.id = 'addQuoteForm';
    
    const title = document.createElement('h2');
    title.textContent = 'Add New Quote';

    // 2. Create the Quote Text Input
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    // 3. Create the Category Input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    // 4. Create the Add Button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    // Attach the addQuote function to the button click event
    addButton.addEventListener('click', addQuote);

    // 5. Append all elements to the form container
    formDiv.appendChild(title);
    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
    
    // 6. Inject the dynamically created form into the main HTML placeholder
    formContainer.appendChild(formDiv);
}

/**
 * Handles validation, adds a new quote to the array, and updates the display.
 */
function addQuote() {
    // Retrieve values from the dynamically created inputs
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Basic validation
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Create the new quote object and add it to the array
    const newQuote = { 
        text: newQuoteText, 
        category: newQuoteCategory 
    };
    quotes.push(newQuote);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Show a new random quote and confirm
    showRandomQuote(); 
    console.log(`Quote added successfully! Total quotes: ${quotes.length}`);
}

// Event-driven programming: Attach the 'Show New Quote' event listener
newQuoteButton.addEventListener('click', showRandomQuote);

// Initialize the application: show a quote and create the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    createAddQuoteForm(); 
});