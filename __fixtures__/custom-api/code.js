function z() {
  My.any.open();
  My.any.getIt().create();
  expect(My.any.openIt(1, 2, '3', global));
  expect(My.any.getIt()
    .openIt(1, 2, '3', global));
  My.any.openIt();
  const it = 1;
  expect(it()).toBe(true);
}
