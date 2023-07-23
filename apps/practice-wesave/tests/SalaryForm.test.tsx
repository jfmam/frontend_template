import { render, screen } from '@testing-library/react';
import SalaryForm from '@/components/salary/SalaryForm';
import { useRegistIncome } from '@/hooks/quries/income/useSalaryInput';

jest.mock('@/hooks/quries/income/useSalaryInput', () => ({
  useRegistIncome: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRegistIncome = useRegistIncome as any;

describe('Salary Form', () => {
  it('모든 input이 들어 갔을 때', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });

    const state = {
      income: 1000000,
      payday: 10,
      quitTime: 18,
      startTime: 9,
      workday: [1, 2, 3, 4, 5],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: 'Done' });

    expect(doneButton).not.toBeDisabled();
  });
  it('startTime 제외', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });
    const state = {
      income: 1000000,
      payday: 10,
      quitTime: 18,
      startTime: null,
      workday: [1, 2, 3, 4, 5],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: /done/i });

    expect(doneButton).toBeDisabled();
  });
  it('quitTime 제외', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });
    const state = {
      income: 1000000,
      payday: 10,
      quitTime: null,
      startTime: 9,
      workday: [1, 2, 3, 4, 5],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: /done/i });

    expect(doneButton).toBeDisabled();
  });

  it('workDay 제외', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });
    const state = {
      income: 1000000,
      payday: 10,
      quitTime: 18,
      startTime: 9,
      workday: [],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: 'Done' });

    expect(doneButton).toBeDisabled();
  });

  it('payday 제외', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });
    const state = {
      income: 1000000,
      payday: null,
      quitTime: 18,
      startTime: 9,
      workday: [1, 2, 3, 4, 5],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: /done/i });

    expect(doneButton).toBeDisabled();
  });
  it('income 제외', () => {
    mockUseRegistIncome.mockReturnValue({ mutate: jest.fn() });
    const state = {
      income: null,
      payday: 10,
      quitTime: 18,
      startTime: 9,
      workday: [1, 2, 3, 4, 5],
    };

    render(
      <SalaryForm
        onChangeIncome={jest.fn()}
        onChangePayday={jest.fn()}
        onChangeQuitTime={jest.fn()}
        onChangeStartTime={jest.fn()}
        onChangeWorkday={jest.fn()}
        state={state}
      />,
    );

    const doneButton = screen.getByRole('button', { name: /done/i });

    expect(doneButton).toBeDisabled();
  });
});
