import { useReducer, Reducer } from 'react';

type Action =
  | {
      type: 'Next_Page';
    }
  | {
      type: 'DONE';
    };

type StageType = { stage: 1 | 2 };

const reducer = (_: StageType, action: Action): StageType => {
  switch (action.type) {
    case 'Next_Page': {
      return { stage: 2 };
    }
    case 'DONE': {
      return { stage: 1 };
    }
    default: {
      return { stage: 1 };
    }
  }
};

const initialState: StageType = {
  stage: 1,
};

export const useStage = () => {
  const [{ stage }, dispatch] = useReducer<Reducer<{ stage: 1 | 2 }, Action>>(reducer, initialState);

  return { stage, dispatch };
};
