import { FluxStandardAction } from 'flux-standard-action';
import { TupleState } from './model';
import { ActionTypes } from './actions';

const initialState: Readonly<TupleState> = {
  bindingSets: [],
  loading: false,
};

const tupleReducer = (prevState: TupleState = initialState, action: FluxStandardAction<any>): TupleState => {
  switch (action.type) {
    case ActionTypes.LOAD_TUPLES_REQUEST:
      return {
        ...prevState,
        loading: true,
      };
    case ActionTypes.LOAD_TUPLES_REQUEST_SUCCESS:
      return {
        loading: false,
        bindingSets: action.payload,
      };
    default:
      return prevState;
  }
};

export default tupleReducer;
