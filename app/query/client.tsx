"use client";

import { useState } from "react";
import { useQuery } from "react-query";

const WebpageClient = () => {
  const pokemons = ["croconaw", "growlithe", "blaziken", "milotic", "buizel"];
  const [pokemon, setPokemon] = useState(pokemons[0]);

  const { data, status } = useQuery(
    ["fetchPokemon", pokemon],
    async (data) => {
      console.log("✱ · file: client.tsx:13 · data:", data);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await response.json();
    },
    {
      staleTime: 10 * 1000, // 10s
    }
  );

  console.log("✱ · file: client.tsx:11 · WebpageClient · status:", status);

  return (
    <section className="container h-screen mx-auto p-6 flex flex-col space-y-4">
      <nav className="flex gap-2">
        {pokemons.map((i) => {
          return (
            <div
              key={i}
              className={`${
                i === pokemon ? "text-blue-500" : "text-slate-800"
              } cursor-pointer hover:underline underline-offset-2 font-semibold`}
            >
              <button type="button" onClick={() => setPokemon(i)}>
                {i}
              </button>
            </div>
          );
        })}
      </nav>

      <h1 className="text-5xl text-blue-500 font-semibold">{pokemon}</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque,
        voluptatibus ratione provident rerum atque facere deleniti sint
        consectetur eius porro odit nemo quibusdam, qui natus saepe, ipsum
        commodi iste tempore!
      </p>
      <pre className="flex-grow overflow-y-auto text-xs h-auto p-2 border">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
};

export default WebpageClient;
