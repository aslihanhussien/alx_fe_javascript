// Step 2: Initial Quotes Array
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", category: "Life" },
    // Add more initial quotes here
];

// Reference to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// Function to display a random quote
function showRandomQuote() {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Advanced DOM Manipulation: Create elements dynamically
    
    // Clear previous content
    quoteDisplay.innerHTML = ''; 

    // Create a new paragraph element for the quote text
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = `"${quote.text}"`;
    
    // Create a new span/small element for the category
    const categorySpan = document.createElement('small');
    categorySpan.textContent = `— Category: ${quote.category}`;
    
    // Append the elements to the display container
    quoteDisplay.appendChild(quoteParagraph);
    quoteDisplay.appendChild(categorySpan);
}

// Function to handle adding a new quote (from Step 3)
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Basic validation
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Create the new quote object
    const newQuote = { 
        text: newQuoteText, 
        category: newQuoteCategory 
    };

    // Add to the quotes array
    quotes.push(newQuote);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Show the newly added quote immediately (optional, but good for feedback)
    showRandomQuote(); 
    
    alert(`Quote added successfully! Total quotes: ${quotes.length}`);
}

// Event-driven programming: Attach the event listener (Step 2)
newQuoteButton.addEventListener('click', showRandomQuote);

// Initialize by showing a quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);