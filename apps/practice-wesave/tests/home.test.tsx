import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import LocalStorage from '@/utils/storage';

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로컬 스토리지에 값이 있을경우: timer로 이동', () => {
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(JSON.stringify({ mock: true }));
    render(<Home />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/timer');
  });

  it('로컬 스토리지에 값이 없을경우: salary로 이동', async () => {
    jest.spyOn(LocalStorage, 'getItem').mockReturnValue(null);
    render(<Home />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/salary');
  });
});
