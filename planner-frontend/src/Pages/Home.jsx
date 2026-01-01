import React from 'react';

function Home() {
  return (
    <div className='home-container'>
      <h1>Adaptive Planner</h1>
      <p>
        Plan your day intelligently with our adaptive task management system.
        Stay organized, focused, and productive.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <a href="/planner">
          <button style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            Get Started →
          </button>
        </a>
        <a href="/auth-page">
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            Sign In
          </button>
        </a>
      </div>
    </div>
  )
}

export default Home;