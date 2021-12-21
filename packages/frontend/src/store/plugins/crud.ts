/**
 * @exports @const
 * Crud UI operations (close modal, etc) via global action props.
 */
export const crud = (store: any) => {
  store.subscribe((mutation: {type: string, payload: any}) => {
    const payload = mutation.payload?.props||{}
    if( payload.__crudClose ) {
      store.commit('meta/CRUD_CLOSE')
    }
  })
}
