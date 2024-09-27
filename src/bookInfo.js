import React from "react";
import './BookInfo.css';
import { Link, RouterProvider, Route, useSearchParams, useNavigate, useLocation } from 'react-router-dom'

export default function BookInfo() {
  const [book, setBook] = React.useState()
  const location = useLocation()
  const path = location.pathname.slice(7)
  let { state } = useLocation();
  const cachedBook = state.bookDisplay
  React.useEffect(() => {
    state.bookInfo ? setBook(state.bookInfo): fetchBook();
  }, [])
  async function aquireBook() {
    const url = `https://www.googleapis.com/books/v1/volumes/${path}`;
    try {
      const response = await fetch(url)
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }
  async function fetchBook() {
    const book = await aquireBook()
    setBook(book)
  }
  return (
      <div className="bookBody">
        {book ? ( <div className="bookCenter">
          <div className="bookLeft">
            <div className='bookInfoImage'>
              {book.volumeInfo?.imageLinks?.thumbnail ? (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt="Book cover" />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
            <div className="bookFurtherInfo">
            <p><span style={{fontWeight: 'bold'}}>Price</span>: {book.saleInfo?.listPrice ? '$' + book.saleInfo?.listPrice.amount + ' ' + book.saleInfo?.listPrice.currencyCode : 'Unavailable'}</p> 
            <p>
              <Link to={book.volumeInfo.infoLink} style={{color: 'black'}}>
                More about this book
              </Link> 
            </p>
            <p><span style={{fontWeight: 'bold'}}>Categories</span>: {book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Unavailable'}</p>
            <p><span style={{fontWeight: 'bold'}}>Page-count</span>: {book.volumeInfo.pageCount || 'Unavailable'}</p>
            <p><span style={{fontWeight: 'bold'}}>Published Date</span>: {book.volumeInfo.publishedDate || 'Unavailable'}</p>
            </div>
          </div>
          <div className="bookRight">
            <div className="bookInfoTitle">
              {book.volumeInfo?.title || 'No Title Available'}
              <Link to={state?.query ? `/?query=${state.query}` : `/`}>
                <button className="backButton">
                  Back
                </button>
              </Link>
            </div>
            <div className="bookInfoAuthor">
              {book.volumeInfo?.authors?.length > 1 
                ? book.volumeInfo.authors.join(', ') 
                : book.volumeInfo?.authors || 'Unknown Author'}
            </div>
            <div className="bookInfoDescription">
              {book.volumeInfo?.description || 'There is no description for this book'}
            </div>
          </div>
        </div>): <h1>Loading...</h1>}
      </div>
  );
}
