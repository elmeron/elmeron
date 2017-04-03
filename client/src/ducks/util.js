import { fromJS } from 'immutable';

export function act(type, payload) {
  return { type, payload };
}

export function reducer(initialState, handlers) {
  return (state = initialState, action) => {
    const handler = handlers[action.type];

    if (handler) {
      return handler(fromJS(state), action.payload);
    }

    return fromJS(state);
  };
}
