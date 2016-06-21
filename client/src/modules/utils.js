export function createAction(type, payload) {
  if (payload instanceof Error) {
    return { type, error: payload };
  }
  return { type, payload };
}
