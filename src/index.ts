import { Database } from "./lib/db";
import { Writer } from "./lib/writer";

(async () => {
  await Database.fetchPokemonsByGeneration();
  Writer.write(Database.generations, "generations");
  Writer.write(Database.pokemons, "pokemons");

  await Database.fetchSetsBySeries();
  Writer.write(Database.series, "series");
  Writer.write(Database.sets, "sets");

  await Database.fetchCardsBySet();
  for (const setId in Database.cardsBySet) {
    Writer.write(Database.cardsBySet[setId], `cards_${setId}`);
  }
})();
