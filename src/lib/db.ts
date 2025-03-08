import {
  Generations,
  Pokemon,
  Pokemons,
  Series,
  Sets,
  Cards,
  SetId,
} from "./db.types";
import { Tyradex } from "./tyradex";
import TCGdex, { SupportedLanguages, Set as TCGDexSet } from "@tcgdex/sdk";

const LANGS: SupportedLanguages[] = ["fr"];
const EXCLUDED_SERIES = ["tcgp"];

export class Database {
  static generations: Generations = {};
  static pokemons: Pokemons = {};
  static series: Series = {};
  static sets: Sets = {};
  static cardsBySet: Record<SetId, Cards> = {};

  static tcgdex = new TCGdex();

  protected static async fetchGenerations(): Promise<void> {
    const tyradexGenerations = await Tyradex.getGenerations();
    tyradexGenerations.forEach(async (generation) => {
      const { generation: id, from, to } = generation;
      const dbGeneration = { id, from, to };
      this.generations[id] = dbGeneration;
    });
  }

  protected static async fetchPokemons(): Promise<void> {
    for await (const gen of Object.keys(this.generations)) {
      const pokemons = await Tyradex.getPokemonListFromGen(parseInt(gen));
      pokemons.forEach(async (pokemon) => {
        const { pokedex_id, name, generation, sprites, evolution } = pokemon;
        const { fr, en } = name;
        const { regular } = sprites;
        const { pre, next } = evolution || {};
        const evolves_from = pre ? pre[0].pokedex_id : null;
        const evolves_to = next ? next[0].pokedex_id : null;
        const db_pkmn: Pokemon = {
          id: pokedex_id,
          generation,
          info: {
            en: {
              name: en
                .replace("Shifours", "Urshifu")
                .replace("Lovetolos", "Enamorus")
                .replace(/^(Mr\.)(\w+)$/, "$1 $2"),
            },
            fr: {
              name: fr,
            },
          },
          img: regular,
          evolves: { from: evolves_from, to: evolves_to },
        };

        if (!this.pokemons[pokedex_id]) {
          this.pokemons[pokedex_id] = [];
        }
        this.pokemons[pokedex_id].push(db_pkmn);
      });
    }
  }

  protected static async fetchSeries() {
    this.tcgdex.setLang("en");
    const series = ((await this.tcgdex.fetch("series")) || []).filter(
      (s) => EXCLUDED_SERIES.indexOf(s.id) === -1
    );
    return Promise.all(
      series.map(async (serie) => {
        const { id, name, logo } = serie;
        this.series[id] = {
          id,
          info: {
            en: { name, logo: logo ? `${logo}.png` : null },
          },
        };
        for (const lang of LANGS) {
          this.tcgdex.setLang(lang);
          const series = (await this.tcgdex.fetch("series")) || [];
          for (let serie of series) {
            const { id, name, logo } = serie;
            if (this.series[id]) {
              this.series[id].info[lang] = {
                name,
                logo: logo ? `${logo}.png` : null,
              };
            }
          }
        }
      })
    );
  }

  protected static async fetchSets() {
    this.tcgdex.setLang("en");
    return Promise.all(
      Object.keys(this.series).map(async (serieId) => {
        const sets = (await this.tcgdex.fetchWithQuery(
          ["sets"],
          [{ key: "serie.id", value: serieId }]
        )) as TCGDexSet[];
        for (const setBrief of sets) {
          const { id, name, logo, symbol, cardCount } = setBrief;
          const set = await this.tcgdex.fetch("sets", id);

          this.sets[id] = {
            id,
            serieId,
            info: {
              en: { name, logo: logo ? `${logo}.png` : null },
            },
            symbol: symbol ? `${symbol}.png` : null,
            cardCount,
            releaseDate: set?.releaseDate,
          };
        }
        for (const lang of LANGS) {
          this.tcgdex.setLang(lang);
          const sets = (await this.tcgdex.fetchWithQuery(
            ["sets"],
            [{ key: "serie.id", value: serieId }]
          )) as TCGDexSet[];
          for (const set of sets) {
            const { id, name, logo } = set;
            if (this.sets[id]) {
              this.sets[id].info[lang] = {
                name,
                logo: logo ? `${logo}.png` : null,
              };
            }
          }
        }
      })
    );
  }

  protected static async fetchCards() {
    this.tcgdex.setLang("en");
    return Promise.all(
      Object.keys(this.sets).map(async (setId) => {
        const set = await this.tcgdex.fetch("sets", setId);
        this.cardsBySet[setId] = {};
        for (const cardBrief of set?.cards || []) {
          const { id, name, image, localId } = cardBrief;
          const card = (await this.tcgdex.fetch("cards", id)) || ({} as any);

          this.cardsBySet[setId][id] = {
            id,
            info: {
              en: { name, image: image ? `${image}/low.png` : null },
            },
            setId,
            serieId: this.sets[setId].serieId,
            localId,
            rarity: card?.rarity || null,
            variants: card?.variants || {},
          };
        }

        for (let lang of LANGS) {
          this.tcgdex.setLang(lang);
          const set = await this.tcgdex.fetch("sets", setId);
          for (const card of set?.cards || []) {
            const { id, name, image } = card;
            if (this.cardsBySet[setId] && this.cardsBySet[setId][id]) {
              this.cardsBySet[setId][id].info[lang] = {
                name,
                image: image ? `${image}/low.png` : null,
              };
            }
          }
        }
      })
    );
  }

  static async fetchPokemonsByGeneration() {
    await this.fetchGenerations();
    await this.fetchPokemons();
  }

  static async fetchSetsBySeries() {
    await this.fetchSeries();
    await this.fetchSets();
  }

  static async fetchCardsBySet() {
    await this.fetchCards();
  }

  static async getCardsFromSet(setId: string) {
    this.tcgdex.setLang("en");
    return await this.tcgdex.fetchWithQuery(
      ["cards"],
      [{ key: "set.id", value: setId }]
    );
  }
}
