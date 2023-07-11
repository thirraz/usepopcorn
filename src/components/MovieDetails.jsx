import { Loader } from "./Loader"
import { useEffect, useRef, useState } from "react"
import StarRating from "./StarRating"

import { useKey } from "../hooks/useKey"

import { KEY } from "../utils.js"

export function MovieDetails({
	selectedId,
	onCloseMovie,
	onAddWatched,
	watched
}) {
	const [movie, setMovie] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [userRating, setUserRating] = useState("")

	useKey("Escape", onCloseMovie)

	const countRef = useRef(0)

	useEffect(() => {
		if (userRating) countRef.current++
	}, [userRating])

	const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId)

	const watchedUserRating = watched.find(
		(movie) => movie.imdbId === selectedId
	)?.userRating

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre
	} = movie

	// if (imdbRating > 8) [isTop, setIsTop] = useState(true)

	// if (imdbRating > 8) return <p>Greatest ever!</p>

	/* 
	const [isTop, setIsTop] = useState(imdbRating > 8)
	console.log(isTop)

	useEffect(() => {
		setIsTop(imdbRating > 8)
	}, [imdbRating])
	*/

	/* 	const isTop = imdbRating > 8
	console.log(isTop)
 */

	function handleAdd() {
		const newWatchedMovie = {
			imdbId: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
			countRatingDecisions: countRef.current
		}

		onAddWatched(newWatchedMovie)
		onCloseMovie()
	}

	/* useEffect(() => {
		function callback(e) {
			if (e.code === "Escape") {
				onCloseMovie()
			}
		}
		document.addEventListener("keydown", callback)

		return () => document.removeEventListener("keydown", callback)
	}, [onCloseMovie]) */

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true)
			const res = await fetch(
				`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
			)
			const data = await res.json()
			setMovie(data)
			setIsLoading(false)
		}
		getMovieDetails()
	}, [selectedId])

	useEffect(() => {
		if (!title) return
		document.title = `Movie | ${title}`

		// cleanup function
		return () => {
			document.title = "usePopcorn"
		}
	}, [title])

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={() => onCloseMovie()}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie}`} />

						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>

							<p>{genre}</p>
							<p>
								<span>⭐</span> {imdbRating} IMDB rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>

									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+Add to List
										</button>
									)}
								</>
							) : (
								<p>
									You already rated this movie ({watchedUserRating}{" "}
									<span>⭐</span>)
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>
							<b>Starring</b> {actors}
						</p>
						<p>
							<b>Directed by</b> {director}
						</p>
					</section>
				</>
			)}
		</div>
	)
}
