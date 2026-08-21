import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { PeerBenchmarkCard } from '../components/intelligence/PeerBenchmarkCard';

const mockBenchmark = {
  benchmark_model: 'CA-GEI-BENCHMARK-V2',
  peer_sample_count: 25000,
  peer_median_gei: 1.5,
  peer_p25_gei: 1.2,
  peer_p75_gei: 1.8,
  peer_percentile: 45,
  confidence: 'CALIBRATED',
  interpretation: 'Testing interpretation'
};

test('renders PeerBenchmarkCard', () => {
  render(<PeerBenchmarkCard benchmark={mockBenchmark} actualGei={1.4} targetGei={1.3} />);
  expect(screen.getByText(/Empirical GEI Distribution/)).toBeInTheDocument();
});
