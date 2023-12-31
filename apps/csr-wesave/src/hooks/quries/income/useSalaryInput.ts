import { Reducer, useCallback, useReducer } from 'react';
import { useMutation } from 'react-query';
import { Income } from '@/common';
import { checkHour, checkMonth } from '@/utils';

export type InitialStateType = {
  startTime: number | null;
  quitTime: number | null;
  workday: number[];
  payday: number | null;
  income: number | null;
};

type Action =
  | {
      type: 'SET_STARTTIME';
      payload: number;
    }
  | {
      type: 'SET_QUITTIME';
      payload: number;
    }
  | {
      type: 'SET_WORKDAY';
      payload: number;
    }
  | {
      type: 'REMOVE_WORKDAY';
      payload: number;
    }
  | {
      type: 'SET_PAYDAY';
      payload: number;
    }
  | {
      type: 'SET_INCOME';
      payload: number;
    }
  | {
      type: 'SET_ADDITIONAL';
      payload?: Income['additional'];
    }
  | {
      type: 'SET_DAY';
    }
  | {
      type: 'SET_TIME';
      payload?: Income['additional'];
    };

const reducer = (state: InitialStateType, action: Action) => {
  switch (action.type) {
    case 'SET_ADDITIONAL': {
      return {
        ...state,
        additional: action.payload,
      };
    }
    case 'SET_INCOME': {
      return {
        ...state,
        income: action.payload,
      };
    }
    case 'SET_PAYDAY': {
      return {
        ...state,
        payday: action.payload,
      };
    }
    case 'SET_QUITTIME': {
      return {
        ...state,
        quitTime: action.payload,
      };
    }
    case 'SET_STARTTIME': {
      return {
        ...state,
        startTime: action.payload,
      };
    }
    case 'SET_WORKDAY': {
      return {
        ...state,
        workday: [...state.workday, action.payload],
      };
    }
    case 'REMOVE_WORKDAY': {
      return {
        ...state,
        workday: state.workday.filter(item => item !== action.payload),
      };
    }
    default: {
      return state;
    }
  }
};

const initialState: InitialStateType = {
  startTime: null,
  quitTime: null,
  workday: [],
  payday: null,
  income: null,
};

export function useSalaryInput() {
  const [state, dispatch] = useReducer<Reducer<InitialStateType, Action>>(reducer, initialState);

  const onChangeAdditional = useCallback(
    (additional: string) => {
      if (isNaN(+additional)) {
        return;
      }

      dispatch({ type: 'SET_ADDITIONAL', payload: +additional });
    },
    [dispatch],
  );

  const onChangeStartTime = useCallback(
    (startTime: string) => {
      if (isNaN(+startTime) || !checkHour(+startTime)) {
        dispatch({ type: 'SET_STARTTIME', payload: 24 });
        return;
      }

      if (state.quitTime !== null && +startTime >= state.quitTime) {
        dispatch({ type: 'SET_STARTTIME', payload: 0 });
        return;
      }

      dispatch({ type: 'SET_STARTTIME', payload: +startTime });
    },
    [dispatch, state.quitTime],
  );

  const onChangeQuitTime = useCallback(
    (quitTime: string) => {
      if (isNaN(+quitTime) || !checkHour(+quitTime)) {
        dispatch({ type: 'SET_QUITTIME', payload: 24 });
        return;
      }

      if (state.startTime === null) {
        dispatch({ type: 'SET_QUITTIME', payload: +quitTime });
        return;
      }

      if (+quitTime - state.startTime <= 0) {
        dispatch({ type: 'SET_QUITTIME', payload: +quitTime + 12 > 24 ? 24 : +quitTime + 12 });
        return;
      }

      dispatch({ type: 'SET_QUITTIME', payload: +quitTime });
    },
    [dispatch, state.startTime],
  );

  const onChangePayday = useCallback(
    (payday: string) => {
      if (isNaN(+payday) || !checkMonth(+payday)) {
        dispatch({ type: 'SET_PAYDAY', payload: 31 });
        return;
      }

      dispatch({ type: 'SET_PAYDAY', payload: +payday });
    },
    [dispatch],
  );

  const onChangeWorkday = useCallback(
    (workday: number) => {
      if (state.workday.includes(workday)) {
        dispatch({ type: 'REMOVE_WORKDAY', payload: workday });
        return;
      }
      dispatch({ type: 'SET_WORKDAY', payload: workday });
    },
    [dispatch, state.workday],
  );

  const onChangeIncome = useCallback(
    (income: string) => {
      if (isNaN(+income)) {
        return;
      }

      dispatch({ type: 'SET_INCOME', payload: +income });
    },
    [dispatch],
  );

  return {
    onChangeAdditional,
    onChangeIncome,
    onChangePayday,
    onChangeQuitTime,
    onChangeStartTime,
    onChangeWorkday,
    state,
  };
}

// 추후 api connection 필요
const setIncome = async (income: Income) => {
  try {
    localStorage.setItem('income', JSON.stringify(income));

    return null;
  } catch (error) {
    throw new Error('수입 저장에 실패하였습니다.');
  }
};

export function useRegistIncome() {
  return useMutation({
    mutationFn: (income: Income) => setIncome(income),
  });
}
