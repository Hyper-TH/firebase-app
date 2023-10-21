import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db } from './config/firebase';
import { getDocs, collection } from 'firebase/firestore'

function App() {
	// State to keep track of db
	const [movieList, setMovieList] = useState([]);

	// Reference to collection
	// collection(db, name_of_collection)
	const moviesCollectionRef = collection(db, "movies");

	// Run this immediately when get into site
	useEffect(() => {
		const getMovieList = async () => {
			// READ DATA
			try {
				const data = await getDocs(moviesCollectionRef);	
				// console.log(data);
				const filteredData = data.docs.map((doc) => ({
					...doc.data(), 
					id: doc.id
				}));
				// console.log(filteredData);
				setMovieList(filteredData);
			} catch (err) {
				console.error(err);
			};

		};	
			getMovieList();
			// SET MOVIELIST
	}, []);
	

	return (
		<div className="App">
			<Auth />

			<div>
				{movieList.map((movie) => (
					<div>
						<h1 style={{color: movie.recievedAnOscar ? "green" : "red"}}> {movie.title} </h1>
						<p> Date {movie.releaseDate} </p>
					</div>
				))}
			</div>
		</div>
	);
}


// firebase login
// firebase init
// firebase deploy

export default App;
