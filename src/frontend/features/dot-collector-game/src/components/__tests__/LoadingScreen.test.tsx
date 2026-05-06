import { render } from '@testing-library/react';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('renders when visible', () => {
    const { container } = render(<LoadingScreen visible={true} />);
    expect(container.querySelector('.dcg-loading-screen')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    const { container } = render(<LoadingScreen visible={false} />);
    expect(container.querySelector('.dcg-loading-screen')).not.toBeInTheDocument();
  });
});
