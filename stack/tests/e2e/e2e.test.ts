class ImportError extends Error {}

const loadModule = async (modulePath: string) => {
  try {
    return await import(modulePath)
  } catch (e) {
    throw new ImportError(`Unable to import module ${modulePath}`)
  }
}

describe('end-to-end', () => {
  test('run render', async () => {
    // dynamically load because stack-js doesn't always exist
    const { stack } = await loadModule('../../dist/stack-js/stack.js')
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
