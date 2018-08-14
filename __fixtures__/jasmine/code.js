describe('', function () {});
describe('', () => {});
it('', function () {});
it('', () => {});
function x() {
  expect(global.count()).toBe(Number.EPSILON);
}
async function y() {
  expect(await global.count()).toBe(Number.EPSILON);
}
