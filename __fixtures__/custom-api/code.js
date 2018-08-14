function z() {
  My.any.open();
  expect(My.any.openIt(1, 2, '3', global));
  expect(My.any.getIt().openIt(1, 2, '3', global));
  My.any.openIt();
  myglobalApi();
}
