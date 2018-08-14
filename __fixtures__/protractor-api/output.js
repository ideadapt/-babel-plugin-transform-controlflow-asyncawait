it('', async function () {
  await global.all('abc').count();
  await global.all('abc').isDisplayed();

  count(() => {});
  for (let count = 0; count() < 0;) {}
});
