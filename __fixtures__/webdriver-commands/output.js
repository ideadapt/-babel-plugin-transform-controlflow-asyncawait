it('', async function () {
  await global.click();
  await global.all().click();
  await global.all('abc').click();
  const a = global.all('abc').click;
  await global.sendKeys('abc');
});
