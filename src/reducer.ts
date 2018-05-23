import { Reducer, AnyAction } from 'redux';
import { FSA } from 'flux-standard-action';
import { GraphState } from './model';
import { LOAD_RDF_REQUEST_SUCCESS, LOAD_RDF_COMPLETED } from './actions';

const initialState: Readonly<GraphState> = {
  quads: [],
  loading: true,
};

const reducer: Reducer<GraphState> = (prevState: GraphState = initialState, action: FSA<any>) => {
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

export default reducer;
