import formatMoney from '../lib/formatMoney';

describe('formatMoney function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5500)).toEqual('$55');
    expect(formatMoney(5500000)).toEqual('$55,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(5500012)).toEqual('$55,000.12');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(23498327498732948237498327943)).toEqual('$234,983,274,987,329,450,000,000,000.00');
  });
});
