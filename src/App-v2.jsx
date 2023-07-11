/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"

import { NavBar } from "./components/NavBar"
import { Logo } from "./components/Logo"
import { Search } from "./components/Search"
import { NumResults } from "./components/NumResults"
import { ErrorMessage } from "./components/ErrorMessage"
import { Box } from "./components/Box"
import { Main } from "./components/Main"
import { Loader } from "./components/Loader"
import { MovieList } from "./components/MovieList"
import { MovieDetails } from "./components/MovieDetails"
import { WatchedSummary } from "./components/WatchedSummary"
import { WatchedMoviesList } from "./components/WatchedMoviesList"

import { KEY } from "./utils.js"

export function App() {
	const [query, setQuery] = useState("")
	const [movies, setMovies] = useState([])
	const [watched, setWatched] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [selectedId, setSelectedId] = useState(null)

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id))
	}

	function handleCloseMovie() {
		setSelectedId(null)
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie])
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbId !== id))
	}

	useEffect(
		function () {
			const controller = new AbortController()

			async function fetchMovies() {
				try {
					setIsLoading(true)
					setError("")

					const res = await 
						`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					)

					if (!res.ok)
						throw new Error("Something went wrong with fetching movies ")

					const data = await res.json()

					if (data.Response === "False") throw new Error("Movie not found")

					setMovies(data.Search)
					console.log(data.Search)
				} catch (error) {
					if (error.name !== "AbortError") setError(error.message)
				} finally {
					setIsLoading(false)
				}
			}

			if (query.length < 3) {
				setMovies([])
				setError("")
				return
			}

			fetchMovies()

			return () => controller.abort()
		},
		[query]
	)

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}{" "}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	)
}

/* function WatchedBox() {
	const [watched, setWatched] = useState(tempWatchedData)
	const [isOpen2, setIsOpen2] = useState(true)

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen2((open) => !open)}
			>
				{isOpen2 ? "–" : "+"}
			</button>
			{isOpen2 && (
				<>
					<WatchedSummary watched={watched} />
					<WatchedMoviesList watched={watched} />
				</>
			)}
		</div>
	)
}
 */
