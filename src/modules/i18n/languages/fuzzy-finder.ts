import Fuse from 'fuse.js'
import { singleton } from 'tsyringe'

@singleton()
export class FuzzyFinder {
	search<T>(items: T[], query: string): T | undefined {
		const fuzzy = new Fuse(items, { includeScore: true })
		const matches = fuzzy.search(query)
		return matches[0]?.item
	}
}
