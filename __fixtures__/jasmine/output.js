describe('', function () {});
describe('', () => {});
it('', async function () {});
it('', async () => {});
async function x() {
  (await expect(global.count())).toBe(Number.EPSILON);
}
async function y() {
  (await expect((await global.count()))).toBe(Number.EPSILON);
}
