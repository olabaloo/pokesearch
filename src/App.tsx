import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import pokemonLogo from "/pokemon.png";
import "./App.css";

function App() {
  const [error, setError] = useState<unknown>(null);

  const fetchOrFail = async (url: string): Promise<Response | undefined> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError(`Response status: ${response.status}`);
        return;
      }

      return await response.json();
    } catch (error) {
      setError(error);
    }
  };

  const searchPokemon = async (e: FormEvent) => {
    e.preventDefault();

    const pokemonName = textInputRef.current?.value.trim().toLowerCase();
    if (pokemonName) {
      const responseJson = await fetchOrFail(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (responseJson) {
        parseSuccessHtml(responseJson);
      }
    }
  };

  const parseSuccessHtml = (data: any): void => {
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const imgSrc = data.sprites.front_default;

    const abilities = data.abilities
      .map((abilityInfo: any) => abilityInfo.ability.name)
      .join(", ");

    const result = `<div class='pokemon-card'><img src="${imgSrc}" alt="${name}"/><p>${name}</p><p>Abilities: ${abilities}</p></div>`;
    cardRef.current!.innerHTML = result;
  };

  const parseErrorHtml = (error: unknown): void => {
    validationErrorRef.current!.innerHTML = error as string;
  };

  useEffect(() => {
    if (error) {
      parseErrorHtml(error);
      setError(null);
    }
  }, [error]);

  const textInputRef = useRef<HTMLInputElement>(null);
  const validationErrorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleInputChange = () => {
    validationErrorRef.current!.innerHTML = "";
    cardRef.current!.innerHTML = "";
  };

  const inputId = useId();

  return (
    <>
      <div>
        <img src={pokemonLogo} className="logo" alt="Pokesearch app logo" />
      </div>
      <h1>Pokesearch!</h1>
      <form className="form">
        <label htmlFor={inputId}>Seach for a pokemon:</label>
        <input
          id={inputId}
          ref={textInputRef}
          type="text"
          onChange={handleInputChange}
        />
        <button onClick={(e: FormEvent) => searchPokemon(e)}>Search</button>
        <div
          className="validation-error"
          role="alert"
          ref={validationErrorRef}
        ></div>
        <div className="pokemon-card" ref={cardRef}></div>
      </form>
    </>
  );
}

export default App;
