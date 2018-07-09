import { decodeData, encodeData } from '../src/lib/util';

describe('util test', () => {
  it('decodeData and encodeData should work correctly', () => {
    const data = {
      a: '123456',
      b: true,
      c: {
        d: 'apple',
      },
      e: '<script>alert("gg")</script>',
    };

    const encodedData = encodeData(data);

    // the content should be shuffled
    expect(encodedData.indexOf('script')).toBe(-1);
    expect(encodedData.indexOf('apple')).toBe(-1);

    // decoded data should be the same with the original data
    const afterData = decodeData(encodedData);
    expect(afterData.a).toBe(data.a);
    expect(afterData.b).toBe(data.b);
    expect(afterData.c.d).toBe(data.c.d);
    expect(afterData.e).toBe(data.e);
  });
});
