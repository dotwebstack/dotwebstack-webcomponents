import { GraphState, GraphAction } from '.';
import { LOAD_RDF_REQUEST_SUCCESS, LOAD_RDF_COMPLETED } from './actions';

const initialState: GraphState = {
  quads: [],
  loading: true,
};

export default (prevState: GraphState = initialState, action: GraphAction) => {
  switch (action.type) {
    case LOAD_RDF_REQUEST_SUCCESS:
      return {
        ...prevState,
        quads: [...prevState.quads, ...action.payload],
      };
    case LOAD_RDF_COMPLETED:
      return {
        ...prevState,
        loading: false,
      };
    default:
      return prevState;
  }
};
