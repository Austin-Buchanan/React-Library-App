import React from 'react';
import './App.css';

let bufferArray = [];

const saveLibrary = (bookArray) => {
  localStorage.setItem('bookArray', JSON.stringify(bookArray));
}

const loadLibrary = (bookArray) => {
  const toLoad = JSON.parse(localStorage.getItem('bookArray'));
  bufferArray = toLoad;
  return bufferArray;
}

const updateArray = (key, textUpdate) => {
  let keyArray = key.split('-');
  switch (keyArray[0]) {
    case "bookKey":
      bufferArray[keyArray[1]].book = textUpdate;
      break;
    case "authorKey":
      bufferArray[keyArray[1]].author = textUpdate;
      break;
    case "pagesKey":
      bufferArray[keyArray[1]].pages = textUpdate;
      break;
    case "statusKey":
      bufferArray[keyArray[1]].status = textUpdate;
      break;
    case "ratingKey":
      bufferArray[keyArray[1]].rating = textUpdate;
      break;
    default:
      console.log("Could not locate key for update.");
      break;
  }
}

class NewBookForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label>Book: <input type="text" name='book'/></label>
        <label>Author: <input type="text" name='author'/></label>
        <label>Pages: <input type="text" name='pages'/></label>
        <label>Status: <input type="text" name='status'/></label>
        <label>Rating: <input type="text" name='rating'/></label>
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}

class RemoveBox extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleRemoval}>
        <label>Remove <input type="text" name="removeBox"/></label>
        <input type="submit" value="Submit"/>
      </form>
    )
  }
}

class EditBox extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleEdit}>
        <label>Edit <em>{this.props.previousText}</em>: <input type="text" name="editBox"/></label>
        <input type="submit" value="Submit"/>
      </form>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
      addingBook: false,
      removingBook: false,
      formSubmitted: false,
      editing: false,
      itemEditing: "",
      keyEditing: ""
    }
    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoval = this.handleRemoval.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.startEditing = this.startEditing.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('bookArray') !== null) {
      this.setState({
        bookList: loadLibrary("bookArray")
      });
    }
  }

  addBook() {
    this.setState({
      bookList: bufferArray,
      addingBook: true
    })
  }

  removeBook() {
    this.setState({
      removingBook: true
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    const bookToAdd = {
      book: event.target.book.value,
      author: event.target.author.value,
      pages: event.target.pages.value,
      status: event.target.status.value,
      rating: event.target.rating.value
    }
    bufferArray.push(bookToAdd);
    return Promise.resolve(this.setState({
      bookList: bufferArray,
      addingBook: false
    })).then(saveLibrary(bufferArray));
  }

  handleRemoval(event) {
    event.preventDefault();
    const bookToRemove = event.target.removeBox.value;
    
    bufferArray.forEach((element) => {
      if (element.book === bookToRemove){
        bufferArray.splice(bufferArray.indexOf(element), 1);
        return Promise.resolve(this.setState({
          bookList: bufferArray,
          removingBook: false
        })).then(saveLibrary(bufferArray));
      }
    });
  }

  handleEdit(event) {
    event.preventDefault();
    updateArray(this.state.keyEditing, event.target.editBox.value);
    return Promise.resolve(this.setState({
      editing: false,
      bookList: bufferArray,
      itemEditing: ""
    })).then(saveLibrary(bufferArray));
  }

  startEditing(event) {
    this.setState({
      editing: true,
      itemEditing: event.target.textContent,
      keyEditing: event.target.id
    });
  }

  render() {
    const rows = this.state.bookList.map(x => 
        <tr key={`rowKey-${this.state.bookList.indexOf(x)}`}>
          <td key={`bookKey-${this.state.bookList.indexOf(x)}`} id={`bookKey-${this.state.bookList.indexOf(x)}`} onClick={this.startEditing}>{x.book}</td>
          <td key={`authorKey-${this.state.bookList.indexOf(x)}`} id={`authorKey-${this.state.bookList.indexOf(x)}`} onClick={this.startEditing}>{x.author}</td>
          <td key={`pagesKey-${this.state.bookList.indexOf(x)}`} id={`pagesKey-${this.state.bookList.indexOf(x)}`} onClick={this.startEditing}>{x.pages}</td>
          <td key={`statusKey-${this.state.bookList.indexOf(x)}`} id={`statusKey-${this.state.bookList.indexOf(x)}`} onClick={this.startEditing}>{x.status}</td>
          <td key={`ratingKey-${this.state.bookList.indexOf(x)}`} id={`ratingKey-${this.state.bookList.indexOf(x)}`} onClick={this.startEditing}>{x.rating}</td>
        </tr>
      );
    return (
      <div>
        <h1>Austin's Library</h1>
        <button onClick={this.addBook}>Add Book</button>
        <button onClick={this.removeBook}>Remove Book</button>
        {this.state.addingBook && <NewBookForm handleSubmit={this.handleSubmit} handleChange={this.handleChange}/>}
        {this.state.removingBook && <RemoveBox handleRemoval={this.handleRemoval}/>}
        {this.state.editing && <EditBox handleEdit={this.handleEdit} previousText={this.state.itemEditing}/>}
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
