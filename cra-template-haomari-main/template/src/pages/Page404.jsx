import { Link } from 'react-router-dom'

export default function Page404() {
	return (
		<main className="page404">
			<div className="page404__container">
				<h2 className="page404__title">Sorry, the page you were looking for was not found.</h2>
				<Link to={"/"} className="page404__link">Return to home</Link>
			</div>
		</main>
	)
}