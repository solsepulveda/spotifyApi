import { useEffect, useState } from 'react'
import './App.css'



var CLIENT_ID = '28bac99753f8459fa9b3cb4c0c1fdd03';
var CLIENT_SECRET = 'caf8ca0fb5324a6ca2122a506e4e8d76';

function App() {
  const [accessToken, setAccessToken] = useState('')
  const [search, setSearch] = useState('')
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false);


  /*   var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }; */

  const spotifyAuth = () => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((result) => result.json())
      .then(data =>
        setAccessToken(data.access_token)
      )

  }

  useEffect(() => {
    spotifyAuth()
  }, [])

  const getEverything = async () => {
    setLoading(true);

    var artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    const artistId = await fetch('https://api.spotify.com/v1/search?q=' + search + '&type=artist', artistParameters)
      .then(response => response.json())
      .then(data => {
        return data.artists.items[0].id
      });

    const albumId = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums', artistParameters)
      .then(response => response.json())
      .then(data => setAlbums(data.items));
    setLoading(false);
  }

  console.log(albums)


  const handleSearch = () => {
    getEverything()
  }

  return (
    <div className='container'>
      <h1>Álbumes bonitos</h1>
      <div>
        <input placeholder='escribe el nombre de un artista'
        onChange={(e) => setSearch(e.target.value)}
        onKeyDownCapture={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }} />
     
      </div>
      <div className='filas'>
        {albums.map((album, i) => {
          return (
            <div className='tarjeta' key={i}>
              <img src={album.images[0].url} />
              <h3>{album.name}</h3>
            </div>)
        })}
      </div>
    </div>
  )
}

export default App
