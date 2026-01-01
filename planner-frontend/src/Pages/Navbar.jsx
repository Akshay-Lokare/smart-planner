
function Navbar() {
  return (
    <div className="titlebar">
      <h2 className='home-title'>Adaptive Planner</h2>

      <a href="/home">Home</a>
      <a href="/auth-page">Auth</a>
      <a href="/planner">Planner</a>
      <a href="/settings">Settings</a>
    </div>
  )
}

export default Navbar;