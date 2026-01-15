import { useRef, useState, type FormEvent } from "react";
import pokemonLogo from "/pokemon.png";
import "./App.css";

function App() {

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
        <img src={pokemonLogo} className="logo" alt="Pokesearch app logo" />
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
