// MyComponent.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileLoad from '../src/components/FileLoad';

test('renders initial count', () => {
  render(<FileLoad />);
  const countElement = screen.getByTestId('count');
  expect(countElement).toHaveTextContent('Count: 0');
});

test('increments count on button click', () => {
  render(<FileLoad />);
  const buttonElement = screen.getByText('Increment');
  const countElement = screen.getByTestId('count');

  fireEvent.click(buttonElement); // 模拟点击按钮
  expect(countElement).toHaveTextContent('Count: 1');

  fireEvent.click(buttonElement); // 再次点击按钮
  expect(countElement).toHaveTextContent('Count: 2');
});
