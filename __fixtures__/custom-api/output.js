async function z() {
  await My.any.open();
  My.any.getIt().create();
  expect((await My.any.openIt(1, 2, '3', global)));
  expect((await My.any.getIt().openIt(1, 2, '3', global)));
  await My.any.openIt();
  const it = 1;
  expect(it()).toBe(true);
}
