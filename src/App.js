import './App.css';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Link, RouterProvider, Route, createBrowserRouter } from 'react-router-dom'
import BookFinder from './book_finder';
import BookInfo from './bookInfo';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BookFinder />,
    },
    {
      path: "/books/:id",
      element: <BookInfo />
    }
  ]);
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;

