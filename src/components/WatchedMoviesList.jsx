import { WatchedMovie } from "./WatchedMovie"

export function WatchedMoviesList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((movie, i) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID || i}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	)
}
