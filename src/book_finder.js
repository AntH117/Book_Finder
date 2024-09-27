import React from "react";
import './App.css';
import { Link, RouterProvider, Route, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import GoogleLogo from './Images/Google.png'

export default function BookFinder() {
  const [bookDisplay, setBookDisplay] = React.useState()
  let [searchParams, setSearchParams] = useSearchParams();
  const [maxResults, setMaxResults] = React.useState(20)
  const [query, setQuery] = React.useState('')
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(bookDisplay)
      if (!searchParams.get('query')) {
        fetchBooks('A')
      } else {
        fetchBooks(searchParams.get('query'))
      }
  }, [searchParams.get('query'), maxResults])
  

  async function searchBooks(query, max = maxResults) {
    const APIKey = 'AIzaSyD5a4Zw-chl5T7ap6BuH881VFM_7herYiw';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${APIKey}&maxResults=${max}`;
    try {
      const response = await fetch(url)
      const data = await response.json()
      return data.items;
    } catch (error) {
      console.error(error)
    }
  }
  async function fetchBooks(query) {
    const books = await searchBooks(query)
    console.log(books)
    const bookElements = books?.map((x, index) => {
      return (
        <BookTemplate title={x.volumeInfo?.title} bookId={x.id} description={x.volumeInfo?.description} key={index} author={x.volumeInfo?.authors ? x.volumeInfo?.authors?.length > 1 ? x.volumeInfo?.authors.join(', ') : x.volumeInfo?.authors : 'No Author Found'} image={x.volumeInfo.imageLinks?.thumbnail} link={x.volumeInfo.previewLink} bookInfo={x}/>
      )
    })
    if (searchParams.get('query')) {
      setQuery(searchParams.get('query'))
    }
    setBookDisplay(bookElements)
  }

  function BookTemplate({title, author, description, image, bookId, bookInfo}) {
  
    return <div className='bookTemplate'>
    <div className='bookImage'>
      {image ? <img src={image}></img> : <p>No Image Avaliable</p>}
    </div>
    <div className='bookInfo'>
        <div className='bookTitle'>
          <Link to={`/books/${bookId}`} style={{ textDecoration: 'none', color: 'green' }} state={{bookInfo, query}}>
            {title}
          </Link>
        </div>
        <div className='bookAuthor'>
          {author}
        </div>
        <div className='bookDescription'>
          {description ? description : 'There is no description for this book'}
        </div>
    </div>
</div>}
function handleSearch() {
  const searchQuery = document.getElementById('searchBox').value
  if (searchQuery?.length >= 1) {
    navigate(`/?query=${searchQuery}`)
    setQuery(searchQuery)
    setMaxResults(20)
  }
}
  return (
    <div className="App">
      <div className='box'>
        <img className="google" src={GoogleLogo}></img>
        {bookDisplay ? (<div className="content">
          <div className='searchRow'>
            <input className='searchBox' placeholder='Begin your search here' id='searchBox'></input>
            <button className='searchButton' onClick={() => handleSearch()}>Search</button>
          </div>
          <div className='bookContainer'>
            {bookDisplay}
          </div>
          {maxResults < 40 ? ( <button className="moreButton" onClick={() => 
              {
                if (maxResults <= 30) {
                  setMaxResults(preVal => preVal += 10)
                }
              }
            }>More</button>) : null}
        </div>) : (<p>Loading Books</p>)}
      </div>
    </div>
  );
}