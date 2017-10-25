export default {
   reduce: (state,reduceFn, payload) => reduceFn ? reduceFn(state, payload) : state,
}