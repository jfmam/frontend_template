import { createContext, ReactNode, Dispatch, SetStateAction, useState, useContext } from 'react';

interface ModalContextProps {
  children: ReactNode;
}

export type ChallengeMenuType = 'today-challenge' | 'achievement-status' | 'my-achievement' | 'register';

const ChallengeMenuStateContext = createContext<ChallengeMenuType>('today-challenge');
const ChallengeMenuDispatchContext = createContext<Dispatch<SetStateAction<ChallengeMenuType>>>(
  () => 'today-challenge',
);

export function ChallengeMenuContext({ children }: ModalContextProps) {
  const [challengeMenu, setChallengeMenu] = useState<ChallengeMenuType>('today-challenge');

  return (
    <ChallengeMenuDispatchContext.Provider value={setChallengeMenu}>
      <ChallengeMenuStateContext.Provider value={challengeMenu}>{children}</ChallengeMenuStateContext.Provider>
    </ChallengeMenuDispatchContext.Provider>
  );
}

export function useChallengeMenuState() {
  const state = useContext(ChallengeMenuStateContext);

  return state;
}

export function useChallengeMenuDispatch() {
  const dispatch = useContext(ChallengeMenuDispatchContext);

  return dispatch;
}
