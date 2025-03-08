# cardex-data

> Computed data used by cardex.

## Run

```bash
npm i && npm run start
```

Files will be generated in `data` folder.

## Data and structure

The database relies on 2 sources:

- [Tyradex](https://github.com/Yarkis01/TyraDex): API to get the list of generations and Pokemons
- [TCGdex](https://github.com/tcgdex/cards-database): API to get everything card related (series, sets, cards)

It's mainly made for my usage, as a french person. The data search is made primary in english because there is a better coverage in TCGdex in English, and then the data are retrieved in other languages.

List of supported languages:

```ts
// src/lib/db.types.ts#L1-L1

type SupportedLanguages = "en" | "fr";
```

### Languages

The database

### `generations.json`

> All Pokemon generation.

```ts
// src/lib/db.types.ts#L3-L11

/** Generations */
type GenerationId = number;
export type Generation = {
  id: GenerationId;
  from: number;
  to: number;
};

export type Generations = Record<GenerationId, Generation>;
```

### `pokemons.json`

> Map of all Pokemons.

```ts
// src/lib/db.types.ts#L13-L29

/** Pokémons */
type PokemonId = number;
type PokemonL18Info = {
  name: string;
};
type PokemonInfo = Record<SupportedLanguages, PokemonL18Info> & {
  en: PokemonL18Info;
};
export type Pokemon = {
  id: PokemonId;
  info: PokemonInfo;
  generation: number;
  img: string;
  evolves: { from: number | null; to: number | null };
};

export type Pokemons = Record<PokemonId, Pokemon[]>;
```

### `series.json`

> Map of all series.

```ts
// src/lib/db.types.ts#L31-L45

/** Series */
export type SerieId = number;
type SerieL18nInfo = {
  name: string;
  logo: string | null;
};
type SerieInfo = Record<SupportedLanguages, SerieL18nInfo> & {
  en: SerieL18nInfo;
};
export type Serie = {
  id: SerieId;
  info: SerieInfo;
};

export type Series = Record<SerieId, Serie>;
```

### `sets.json`

> Map of all sets.

```ts
// src/lib/db.types.ts#L47-L65

/** Sets */
export type SetId = string;
type SetL18nInfo = {
  name: string;
  logo: string | null;
};
type SetInfo = Record<SupportedLanguages, SetL18nInfo> & {
  en: SetL18nInfo;
};
export type Set = {
  id: SetId;
  serieId: SerieId;
  releaseDate: string;
  info: SetInfo;
  symbol: string | null;
  cardCount: { total: number; official: number };
};

export type Sets = Record<SetId, Set>;
```

### `cards_<set_id>.json`

> Map of cards in the set.

```ts
// src/lib/db.types.ts#L67-L85

/** Cards */
export type CardId = string;
type CardL18nInfo = {
  name: string;
  image: string | null;
};
type CardInfo = Record<SupportedLanguages, CardL18nInfo> & {
  en: CardL18nInfo;
};
export type Card = {
  id: CardId;
  info: CardInfo;
  setId: SetId;
  serieId: SerieId;
  rarity: string | null;
  variants: Record<string, boolean>;
};

export type Cards = Record<CardId, Card>;
```
