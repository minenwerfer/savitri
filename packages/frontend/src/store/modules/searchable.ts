import { Module } from '../module'

export class SearchableModule extends Module<{}, {}> {
  constructor() {
    super('searchable', {}, {})
  }

  actions() {
    return {
      search: this.actionHelper('search', 'ITEM_GET')
    }
  }
}
