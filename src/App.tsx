import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import pokemonLogo from "/pokemon.png";
import "./App.css";

function App() {
  const [error, setError] = useState<unknown>(null);
  const [inputHasChanged, setInputHasChanged] = useState(false);

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

  const searchPokemon = async () => {
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

  const fetchAbilitiesDetails = async (abilities: [], name: string) => {
    abilitiesRef.current!.innerHTML += `<h3>${name}'s abilities explained:</h3>`;
    abilities.map(async (abilityInfo: any) => {
      const responseJson = await fetchOrFail(abilityInfo.ability.url);
      if (responseJson) {
        abilitiesRef.current!.innerHTML += `<details class='ability-detail'><summary>${
          responseJson.name.charAt(0).toUpperCase() + responseJson.name.slice(1)
        }</summary><p>${responseJson.effect_entries[1].effect}</p></details>`;
      }
    });
  };

  const getNamesList = (namesArray: any): string => {
    return new Intl.ListFormat("en", {
      type: "conjunction",
    }).format(namesArray);
  };

  const parseSuccessHtml = (data: any): void => {
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const imgSrc = data.sprites.front_default;

    const nameAndImageHtml = `<figure><figcaption><h2>${name}</h2></figcaption><img src="${imgSrc}" alt="${name}"/></figure>`;

    const abilityNameArray = data.abilities.map(
      (abilityInfo: any) => abilityInfo.ability.name
    );
    const abilityNames = getNamesList(abilityNameArray);

    const typeNameArray = data.types.map((typeInfo: any) => typeInfo.type.name);
    const typeNames = getNamesList(typeNameArray);

    const detailsHtml = `<ul class="pokemon-details"><li>Abilities: ${abilityNames}.</li><li>Types: ${typeNames}.</li></ul>`;

    cardRef.current!.innerHTML = `${nameAndImageHtml}${detailsHtml}`;

    fetchAbilitiesDetails(data.abilities, name);
  };

  const parseErrorHtml = (error: unknown): void => {
    validationErrorRef.current!.innerHTML = error as string;
  };

  const resetErrorAndInfo = () => {
    validationErrorRef.current!.innerHTML = "";
    abilitiesRef.current!.innerHTML = "";
    cardRef.current!.innerHTML = "";
  };

  useEffect(() => {
    if (error) {
      parseErrorHtml(error);
    }
  }, [error]);

  useEffect(() => {
    if (inputHasChanged) {
      resetErrorAndInfo();
    }
  }, [inputHasChanged]);

  const handleInputChange = () => {
    setError(null);
    setInputHasChanged(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputHasChanged) {
      searchPokemon();
      setInputHasChanged(false);
    }
  };

  const textInputRef = useRef<HTMLInputElement>(null);
  const validationErrorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const abilitiesRef = useRef<HTMLDivElement>(null);

  const inputId = useId();

  return (
    <>
      <div>
        <img src={pokemonLogo} className="logo" alt="Pokesearch app logo" />
      </div>
      <h1>Pokesearch!</h1>
      <form className="form">
        <label>
          Seach for a pokemon:
          <input
            id={inputId}
            ref={textInputRef}
            type="text"
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSubmit}>Search</button>
        <div
          className="validation-error"
          role="alert"
          ref={validationErrorRef}
        ></div>
        <div className="pokemon-card" ref={cardRef}></div>
        <aside className="abilities-aside" ref={abilitiesRef}></aside>
      </form>
    </>
  );
}

export default App;
