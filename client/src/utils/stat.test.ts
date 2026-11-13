import { update_show } from "./stat";
import { get_setlists, create_user_setlists } from '../router/statRoutes.ts';
import { expect, test } from 'vitest';
import { createUser } from "../router/userRoutes";

test('Test update', async () => {
  const test = await get_setlists('14-08-2026');
  const user = await createUser('gruggle', 'test23');
  const set = await create_user_setlists(user.id);
  const set2 = await update_show(set, test.city, test.date, test.num_songs, test.setlist);
  const test2 = await get_setlists('15-08-2026');
  const show = await update_show(set2, test2.city, test2.date, test2.num_songs, test2.setlist);
  console.log(show);
  expect(show.city).toBe({ "Buena Vista": 2 });
});