import Fuse from 'fuse.js'

export interface IFuzzyFinder {
  search<T>(items: T[], query: string): T | undefined
}

export class FuzzyFinder implements IFuzzyFinder {
  search<T>(items: T[], query: string): T | undefined {
    const fuzzy = new Fuse(items, { includeScore: true })
    const matches = fuzzy.search(query)
    return matches[0]?.item
  }
}
