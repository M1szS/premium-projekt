import { Link, useRouteError } from 'react-router-dom'

// Component to display an error message and status
export default function Error() {
  // Fetch the error details from the route
  const error = useRouteError()

  return (
    <main className="error">
      <div className="error__container">
        {/* Display the error title */}
        <h2 className="error__title">An error occurred!</h2>
        
        {/* Display the error message and status */}
        <p className="error__message">{error.message}</p>
        <p className="error__status">{error.statusText + "(" + error.status + ")"}</p>
        
        {/* Link to return to the home page */}
        <Link to={"/"} className="error__link">Return to home</Link>
      </div>
    </main>
  )
}