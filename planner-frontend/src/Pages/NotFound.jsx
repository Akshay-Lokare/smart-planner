import React from 'react';

function NotFound() {
  return (
    <div className='notfound-container'>
      <h1>404</h1>
      <p>Oops! Page not found</p>
      <a href="/">
        <button>Go Home</button>
      </a>
    </div>
  )
}

export default NotFound;