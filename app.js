class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}
class UI {
	addBookToList(book) {
		const list = document.getElementById('book-list');

		// create tr element
		const row = document.createElement('tr');

		// insert columns
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="delete">X</a></td>`;

		list.appendChild(row);
	}
	showAlert(msg, type) {
		// create div
		const div = document.createElement('div');
		// add classes
		div.className = ` alert ${type}`;

		// add text
		div.appendChild(document.createTextNode(msg));

		// get parent
		const container = document.querySelector('.container');
		// get form
		const form = document.querySelector('#book-form');

		// inset alert
		container.insertBefore(div, form);

		// time out after 2 seconds
		setTimeout(function () {
			document.querySelector('.alert').remove();
		}, 2000);
	}
	deleteBook(target) {
		if (target.className === 'delete') {
			target.parentElement.parentElement.remove();
			return true;
		} else {
			return false;
		}
	}
	clearFields() {
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
		document.getElementById('isbn').value = '';
	}
}

// local store class
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}
	static displayBooks() {
		const books = Store.getBooks();
		const ui = new UI();

		books.forEach(function (book) {
			ui.addBookToList(book);
		});
	}
	static addBook(book) {
		const books = Store.getBooks();

		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}
	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach(function (book, index) {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));
	}
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// add book event listeners
document.getElementById('book-form').addEventListener('submit', function (e) {
	// get form values
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const isbn = document.getElementById('isbn').value;

	// instantiate book
	const book = new Book(title, author, isbn);

	// instantiate UI
	const ui = new UI();

	// validate
	if (title === '' || author === '' || isbn === '') {
		// error alert
		ui.showAlert('Please fill in all the fields', 'error');
	} else {
		// add book to list
		ui.addBookToList(book);

		// add to localstorage
		Store.addBook(book);

		// show alert
		ui.showAlert('book added', 'success');

		// clear fields
		ui.clearFields();
	}

	e.preventDefault();
});

// delete book event listener
document.getElementById('book-list').addEventListener('click', function (e) {
	// instantiate UI
	const ui = new UI();

	if (ui.deleteBook(e.target)) {
		// remove from LS
		Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

		ui.showAlert('book removed', 'success');
	}
	e.preventDefault();
});
