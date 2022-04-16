import { test, expect } from '@jest/globals';
import jest from '../src/index.js';

test('jest', () => {
  expect(jest(2)).toEqual(4);
  expect(jest(9)).toEqual(18);
});
