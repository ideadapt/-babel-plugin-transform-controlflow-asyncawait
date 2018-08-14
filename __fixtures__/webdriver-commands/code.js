it('', async function(){
  global.click();
  global.all().click();
  global.all('abc').click();
  const a = global.all('abc').click;
  global.sendKeys('abc');
});
