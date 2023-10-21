import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore'

function App() {
	// State to keep track of db
	const [movieList, setMovieList] = useState([]);

	// New Movie States
	const [newMovieTitle, setNewMovieTitle] = useState("");
	const [newReleaseDate, setNewReleaseDate] = useState(0);
	const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

	// Reference to collection
	// collection(db, name_of_collection)
	const moviesCollectionRef = collection(db, "movies");

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

	const deleteMovie = async (id) => {
		// Create movie doc, specify document from this db and collection name, and id
		const movieDoc = doc(db, "movies", id);
		await deleteDoc(movieDoc);
		getMovieList();
	};

	// Run this immediately when get into site
	useEffect(() => {
		getMovieList();
	}, []);
	

	const onSubmitMovie = async () => {
		try {
			await addDoc(moviesCollectionRef, {
				title: newMovieTitle, 
				releaseDate: newReleaseDate, 
				recievedAnOscar: isNewMovieOscar
			});

			getMovieList();
		} catch(err) {
			console.log(err);
		}
	};

	return (
		<div className="App">
			<Auth />

			<div>
				<input 
					placeholder='Movie title...' 
					onChange={(e) => setNewMovieTitle(e.target.value)}
				/>
				<input 
					placeholder='Release date...' 
					type='number'
					onChange={(e) => setNewReleaseDate(Number(e.target.value))}	
				/>
				<input 
					type='checkbox' 
					checked={isNewMovieOscar}
					onChange={(e) => setIsNewMovieOscar(e.target.checked)}/>
				<label> Received an Oscar </label>
				<button onClick={onSubmitMovie}> Submit Movie </button>
			</div>
			<div>
				{movieList.map((movie) => (
					<div>
						<h1 style={{color: movie.recievedAnOscar ? "green" : "red"}}> 
							{movie.title} 
						</h1>
						<p> Date {movie.releaseDate} </p>

						<button onClick={() => deleteMovie(movie.id)}> Delete Movie </button>
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
