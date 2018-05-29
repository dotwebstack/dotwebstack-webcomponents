import { FluxStandardAction } from 'flux-standard-action';
import { GraphState } from './model';
import { ActionTypes } from './actions';

const initialState: Readonly<GraphState> = {
  quads: [],
  loading: false,
};

const graphReducer = (prevState: GraphState = initialState, action: FluxStandardAction<any>): GraphState => {
  switch (action.type) {
    case ActionTypes.LOAD_RDF_REQUEST:
      return {
        ...prevState,
        loading: true,
      };
    case ActionTypes.LOAD_RDF_REQUEST_SUCCESS:
      return {
        ...prevState,
        quads: [...prevState.quads, ...action.payload],
      };
    case ActionTypes.LOAD_RDF_COMPLETED:
      return {
        ...prevState,
        loading: false,
      };
    default:
      return prevState;
  }
};

export default graphReducer;
