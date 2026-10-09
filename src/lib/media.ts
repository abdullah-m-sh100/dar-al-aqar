/**
 * Photography is sourced from Unsplash under the Unsplash License
 * (https://unsplash.com/license). Credits are kept with every photo and
 * surfaced in the UI. Images are representative and never depict the
 * actual listed unit.
 */
export type Photo = {
  src: string;
  /** Photographer name as published on Unsplash. */
  credit: string;
};

export function unsplash(id: string, credit: string): Photo {
  return { src: `https://images.unsplash.com/photo-${id}`, credit };
}
