import { stack } from '../../dist/stack-js/stack.js'

describe('end-to-end', () => {
  test('run render', async () => {
    const actual = stack.render({
      this: {
        metadata: {
          name: 'sample-app',
          namespace: 'default'
        },
        spec: '{"image":"nginx"}',
      },
    });
    expect(actual).toBeInstanceOf(Object);
  });
});
