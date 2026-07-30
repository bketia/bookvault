const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const results = document.getElementById("results");
const categorySelect = document.getElementById("categorySelect");

// Default placeholder image
const placeholderImage =
"https://dummyimage.com/200x300/e0e0e0/555555&text=No+Cover";

// Search button click
searchBtn.addEventListener("click", searchBooks);
sortSelect.addEventListener("change", searchBooks);

// Also search when Enter is pressed
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBooks();
    }
});

async function searchBooks() {

    const search = searchInput.value.trim();
    const category = categorySelect.value;

    let query = search;

    if(category !== ""){
    query += ` subject:${category}`;
    }

    if (query === "") {
        results.innerHTML = "<h2>Please enter a search term.</h2>";
        return;
    }

    results.innerHTML = `
    <div class="loader"></div>
    `;
    try {

        const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch books.");
        }

        const data = await response.json();

        if (!data.docs || data.docs.length === 0) {
            results.innerHTML = "<h2>No books found.</h2>";
            return;
        }

        displayBooks(data.docs);

    } catch (error) {

        results.innerHTML = `
            <h2>Error</h2>
            <p>${error.message}</p>
        `;

    }

}

function displayBooks(books) {

    results.innerHTML = "";

    const sort = sortSelect.value;

if (sort === "newest") {
    books.sort((a, b) => {
        return (b.first_publish_year || 0) - (a.first_publish_year || 0);
    });
} else if (sort === "oldest") {
    books.sort((a, b) => {
        return (a.first_publish_year || 9999) - (b.first_publish_year || 9999);
    });
}
    document.getElementById("bookCount").innerHTML =
    `${books.length} books found`;

    books.slice(0, 20).forEach(book => {

        const title = book.title || "No Title";

        const authors = book.author_name
            ? book.author_name.join(", ")
            : "Unknown Author";

        const year = book.first_publish_year || "Unknown";

        const image = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "https://dummyimage.com/200x300/e0e0e0/555555&text=No+Cover";

        const card = document.createElement("div");

        card.classList.add("book-card");

        card.innerHTML = `

        <img src="${image}" alt="${title}">

        <h2>${title}</h2>

        <h4>👤 ${authors}</h4>

        <p><strong>📅 Published:</strong> ${year}</p>

        <a href="https://openlibrary.org${book.key}" target="_blank">

          View Details
        </a>

    `;

        results.appendChild(card);

    });

}