import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchComponent from './components/SearchComponent';

test('opens a block page when searching by block height', async () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<SearchComponent />} />
        <Route path="/block/123" element={<h1>Block 123</h1>} />
      </Routes>
    </MemoryRouter>,
  );

  const input = screen.getByPlaceholderText('Search by Address / Txn Hash / Block');
  fireEvent.change(input, { target: { value: '123' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

  expect(await screen.findByRole('heading', { name: 'Block 123' })).toBeInTheDocument();
});
