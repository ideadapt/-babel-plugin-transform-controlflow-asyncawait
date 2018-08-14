async function z() {
  await My.any.open();
  expect((await My.any.openIt(1, 2, '3', global)));
  expect((await My.any.getIt().openIt(1, 2, '3', global)));
  await My.any.openIt();
  await myglobalApi();
}
