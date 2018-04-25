import GraphAction from './GraphAction';
import GraphState from './GraphState';
import { LOAD_RDF_SUCCESS } from './actions';

const initialState = {
  quads: [],
};

export default (prevState: GraphState = initialState, action: GraphAction) => {
  switch (action.type) {
    case LOAD_RDF_SUCCESS:
      return {
        ...prevState,
        quads: [...prevState.quads, ...action.payload],
      };
    default:
      return prevState;
  }
};
