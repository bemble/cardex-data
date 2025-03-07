type SupportedLanguages = "en" | "fr";

/** Generations */
type GenerationId = number;
export type Generation = {
  id: GenerationId;
  from: number;
  to: number;
};

export type Generations = Record<GenerationId, Generation>;

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
