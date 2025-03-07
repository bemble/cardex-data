export type Generation = {
  generation: number;
  from: number;
  to: number;
};

export type PokemonType = {
  id: number;
  name: { fr: string; en: string; jp: string };
  sprites: string;
};

export type Pokemon = {
  pokedex_id: number;
  generation: number;
  category: string;
  name: { fr: string; en: string; jp: string };
  sprites: {
    regular: string;
  };
  evolution?: { pre: any[] | null; next: any[] | null; mega: any[] | null };
  types: { name: string }[];
};

export class Tyradex {
  constructor() {}

  protected static fetch<T>(path: string, options: any = {}): Promise<T> {
    return fetch(`https://tyradex.vercel.app/api/v1${path}`, options).then(
      (response) => response.json() as Promise<T>
    );
  }

  static getGenerations(): Promise<Generation[]> {
    return this.fetch<Generation[]>("/gen");
  }

  static getPokemonTypes(): Promise<PokemonType[]> {
    return this.fetch<PokemonType[]>("/types");
  }

  static getPokemonListFromGen(gen: number): Promise<Pokemon[]> {
    return this.fetch(`/gen/${gen}`);
  }
}
