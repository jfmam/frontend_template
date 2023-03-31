import { createContext, ReactNode, Dispatch, SetStateAction, useState, useContext } from 'react';

interface ModalContextProps {
  children: ReactNode;
}

const ModalStateContext = createContext<boolean>(false);
const ModalDispatchContext = createContext<Dispatch<SetStateAction<boolean>>>(() => null);

export function ModalContext({ children }: ModalContextProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <ModalStateContext.Provider value={isOpenModal}>
      <ModalDispatchContext.Provider value={setIsOpenModal}>{children}</ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
}

export function useModalState() {
  const state = useContext(ModalStateContext);

  return state;
}

export function useModalDispatch() {
  const dispatch = useContext(ModalDispatchContext);

  return dispatch;
}
