import { useRef, useState, type FormEvent } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  function searchPokemon(e: FormEvent) {
    e.preventDefault();
    const pokemonName = textInputRef.current?.value;
    if (pokemonName) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }

  const textInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Pokesearch!</h1>
      <form className="card">
        <label>
          Seach for a pokemon:
          <input ref={textInputRef} type="text" />
        </label>
        <button onClick={(e: FormEvent) => searchPokemon(e)}>Search</button>
      </form>
    </>
  );
}

export default App;
