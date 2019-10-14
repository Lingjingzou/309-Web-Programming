/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	//initial new info variable for new book
	const Name = document.querySelector('#newBookName').value
	const Author = document.querySelector('#newBookAuthor').value
	const Genre = document.querySelector('#newBookGenre').value
	const New_book = new Book(Name, Author, Genre)
	libraryBooks.push(New_book)
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(New_book)
	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();
	//get index of the target book
    const Book = document.querySelector('#loanBookId').value

	// Get Patron and his/her card num 
	const patronToLoan = patrons[document.querySelector('#loanCardNum').value];

	// Add patron to the book's patron property
	let target_book = libraryBooks[Book];
	target_book.patron = patronToLoan;

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(target_book)
	// Start the book loan timer.
	target_book.setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if(e.target.classList.contains('return')) {

	// Call removeBookFromPatronTable()
	// get the book we want to return by index 
		let book = libraryBooks[parseInt(e.target.parentElement.parentElement.firstElementChild.innerText)]
		removeBookFromPatronTable(book)

	// Change the book object to have a patron of 'null'
	book.patron = null;
	}


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const new_Patron = document.querySelector('#newPatronName').value
	let add_patron = new Patron(new_Patron)
	//push to the last one
	patrons.push(add_patron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(add_patron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book by the index
	let book = libraryBooks[document.querySelector('#bookInfoId').value]
	// Call displayBookInfo()	
	displayBookInfo(book)	
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const bookName = book.title
	const bookID = book.bookId
	const bookPatron = book.patron

	// Create BookName

	const nameTableData = document.createElement('td')
	const TableBookName = document.createTextNode(bookName)
	const strong = document.createElement("STRONG")
	strong.appendChild(TableBookName)
	nameTableData.appendChild(strong)

	// Create BookID

	const bookIdTableData = document.createElement('td')
	bookIdTableData.appendChild(document.createTextNode(bookID))
	
	// Creating Patron if there are any

	const bookPatronTableData = document.createElement('td')
	if (bookPatron !== null) {
		bookPatronTableData.appendChild(bookPatron)
	}

	const newBookRow = document.createElement('tr')
	newBookRow.appendChild(bookIdTableData)
	newBookRow.appendChild(nameTableData)
	newBookRow.appendChild(bookPatronTableData)

	bookTable.firstElementChild.appendChild(newBookRow)

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here

	const bookName = book.title
	const bookID = book.bookId
	const bookPatron = book.patron
	const bookGenre = book.genre
	const bookAuthor = book.author

	//
	const IdField = bookInfo.firstElementChild.firstElementChild
	IdField.innerText = bookID

	const TitleField = IdField.parentElement.nextElementSibling
	TitleField.firstElementChild.innerText = bookName

	const AuthorField = TitleField.nextElementSibling
	// console.log(TitleField.nextElementSibling)
	AuthorField.firstElementChild.innerText = bookAuthor

	const GenreField = AuthorField.nextElementSibling
	GenreField.firstElementChild.innerText = bookGenre

	const PatronField = GenreField.nextElementSibling

	if (bookPatron !== null) {
		PatronField.firstElementChild.innerText = bookPatron.name
	} else {
		PatronField.firstElementChild.innerText = "N / A"
	}

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	// Disect Book info
	const bookID = book.bookId
	const bookPatron = book.patron
	const bookGenre = book.genre
	const bookAuthor = book.author
	const bookTitle = book.title
	
	const table = PatronTableFind(bookPatron)

	const bookIdData = document.createElement('td')
	bookIdData.appendChild(document.createTextNode(bookID))

	const bookTitleData = document.createElement('td')
	const strong = document.createElement('STRONG')
	strong.appendChild(document.createTextNode(bookTitle))
	bookTitleData.appendChild(strong)

	const bookStatusData = document.createElement('td')
	const span = document.createElement('SPAN')
	span.className = 'green'
	span.appendChild(document.createTextNode("Within due date"))
	bookStatusData.appendChild(span)

	const returnData = document.createElement('td')
	const button = document.createElement('button')
	button.className = 'return'
	button.appendChild(document.createTextNode("return"))
	returnData.appendChild(button)

	const newDataRow = document.createElement('tr')
	newDataRow.appendChild(bookIdData)
	newDataRow.appendChild(bookTitleData)
	newDataRow.appendChild(bookStatusData)
	newDataRow.appendChild(returnData)

	table.firstElementChild.appendChild(newDataRow)

	// Need to update the main Table to put patron card num

	const bookRow = helperBookRowFinder(bookID)
	bookRow.firstElementChild.nextElementSibling.nextElementSibling.innerText = bookPatron.cardNumber

}

function helperBookRowFinder(bookId) {

	let currentRow = bookTable.firstElementChild.firstElementChild.nextElementSibling
	let currentBookId = parseInt(currentRow.firstElementChild.innerText)

	while (currentBookId != bookId) {
		currentRow = currentRow.nextElementSibling
		currentBookId = parseInt(currentRow.firstElementChild.innerText)
	}
 
	return currentRow;

}

function helperCreateTableTitle() {

	const header = document.createElement('h4')
	header.appendChild(document.createTextNode('Books on loan'))

	return header

}

function helperCreatePElement(FieldName, FieldValue) {

	const pElement = document.createElement('p')
	const NameTitle = document.createTextNode(FieldName)
	pElement.appendChild(NameTitle)
	
	const nameSpanElement = document.createElement('SPAN')
	const fieldBookName = document.createTextNode(FieldValue)
	nameSpanElement.className = "bold"
	nameSpanElement.appendChild(fieldBookName)
	pElement.appendChild(nameSpanElement)

	return pElement

}

function helperCreateColumn(field) {

	const column = document.createElement('th')
	column.appendChild(document.createTextNode(field))

	return column
}


// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	const P_Element = helperCreatePElement("Name: ", patron.name)

	// Card Number Field

	const Card_Element = helperCreatePElement("Card Number: ", patron.cardNumber)
	const t_Title = helperCreateTableTitle();
	const line_id = helperCreateColumn("BookID")
	const TitleColumn = helperCreateColumn("Title")
	const StatusColumn = helperCreateColumn("Status")
	const ReturnColumn = helperCreateColumn("Return")

	// console.log(ReturnColumn)

	// Create and fill first row \line of Table
	const Line = document.createElement('tr')
	Line.appendChild(line_id)
	Line.appendChild(TitleColumn)
	Line.appendChild(StatusColumn)
	Line.appendChild(ReturnColumn)

	// Create and fill table body
	const table = document.createElement('tbody')
	table.appendChild(Line)

	// Create and fill table
	const table = document.createElement('table')
	table.className = "patronsLoansTable"
	table.appendChild(table)

	//Create div patron
	const inof = document.createElement('div')
	info.className = "patron"
	info.appendChild(P_Element)
	info.appendChild(Card_Element)
	info.appendChild(t_Title)
	info.appendChild(table)
	patronEntries.appendChild(info)
	
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const bt = PatronTableFind(book.patron)

	// find the corrent row to remove 
	let Line = bt.firstElementChild.firstElementChild.nextElementSibling
	let id = parseInt(Line.firstElementChild.innerText)

	while (id !== book.bookId) {
		Line = currentRow.nextElementSibling
		id = parseInt(Line.firstElementChild.innerText)
	}

	bt.firstElementChild.removeChild(Line) 

	// Remove patron from the main book table 
	const bookLine = helperBookRowFinder(book.bookId)
	bookLine.firstElementChild.nextElementSibling.nextElementSibling.innerText = ""

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	console.log('changeToOverdue', book.title)

	// Add code here
	const Patron = book.patron
	const table = PatronTableFind(Patron)
	const bookID = book.bookId

	let c_Line = table.firstElementChild.firstElementChild.nextElementSibling
	let c_BookId = parseInt(c_Line.firstElementChild.innerText)

	while (c_BookId !== bookID) {
		c_Line = c_Line.nextElementSibling
		c_BookId = c_Line.firstElementChild.innerText
			
	}
	//change the text and color of information for this booktable
	let info = c_Line.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
	info.className = 'red'
	info.innerText = 'Overdue'

	

}


//a helper function to find the corresponding patron table of certain patron
function PatronTableFind(patron) {
	//set first booktable element 
	let c_Table = patronEntries.firstElementChild
	//go through all patrons
	for (let i = 0; i < numberOfPatrons; i++) {
		//get the card number of this patron who loaned the book
		const c_Card = parseInt(c_Table.firstElementChild.nextElementSibling.firstElementChild.innerText)
		//if we find this patron then return the element
		if (c_Card === patron.cardNumber) {
			return c_Table.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling
		}
		c_Table = c_Table.nextElementSibling
	}
}
