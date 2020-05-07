import * as assert from 'assert';
import maskUSPhone from '../src/index';

const testSamples = [
  {
    input: 'abc',
    expectedResult: 'abc',
    description: 'should return pristine value when receiving "abc"',
  },
  {
    input: 'abc1234567',
    expectedResult: 'abc1234567',
    description: 'should return pristine value when receiving "abc1234567"',
  },
  {
    input: 'abcdefghij',
    expectedResult: 'abcdefghij',
    description: 'should return pristine value when receiving "abcdefghij"',
  },
  {
    input: '1234567890',
    expectedResult: '(123) 456-7890',
    description: 'should return (123) 456-7890',
  },
  {
    input: '5431260987',
    expectedResult: '(543) 126-0987',
    description: 'should return (543) 126-0987',
  },
];

describe('Array', () => {
  testSamples.forEach((sample) => {
    it(sample.description, () => {
      assert.equal(maskUSPhone(sample.input), sample.expectedResult);
    });
  });
});
