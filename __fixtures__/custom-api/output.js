async function z() {
  await My.any.open();
  My.any.getIt().create();
  await expect(My.any.openIt(1, 2, '3', global));
  await expect(My.any.getIt().openIt(1, 2, '3', global));
  await My.any.openIt();
  const it = 1;
  (await expect(it())).toBe(true);
}
