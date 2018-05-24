import { Reducer, AnyAction } from 'redux';
import { FSA } from 'flux-standard-action';
import { GraphState } from './model';
import { ActionTypes } from './actions';

const initialState: Readonly<GraphState> = {
  quads: [],
  loading: true,
};

const reducer: Reducer<GraphState> = (prevState: GraphState = initialState, action: FSA<any>) => {
  switch (action.type) {
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

export default reducer;
