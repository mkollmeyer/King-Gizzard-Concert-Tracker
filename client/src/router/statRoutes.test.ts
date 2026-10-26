import { expect, test } from 'vitest';
import { get_setlists } from './statRoutes.ts';

test('Test DB', async () => {
  const test = await get_setlists('14-08-2026');
  console.log(test);
  expect(test.city).toBe("Buena Vista");
});