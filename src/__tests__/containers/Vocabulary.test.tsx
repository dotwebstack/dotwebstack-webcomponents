import DataFactory from '../../DataFactory';
import { groupingFunction } from '../../containers/Vocabulary';

const dataFactory = new DataFactory();
const foo = dataFactory.namedNode('foo');
const bar = dataFactory.namedNode('bar');
const literal = dataFactory.literal('literal');

const foo2 = dataFactory.namedNode('foo2');
const bar2 = dataFactory.namedNode('bar2');
const literal2 = dataFactory.literal('literal2');

describe('Vocabulary::groupingFunction', () => {
  it('should group quads with the same subject', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(foo2, bar2, literal2),
    ];

    const expectedQuads =
      {FOO: [
        dataFactory.quad(foo, bar, literal),
        dataFactory.quad(foo, bar, literal),
      ],
        FOO2: [
          dataFactory.quad(foo2, bar2, literal2),
        ]};

    const grouped = quads.reduce(groupingFunction, Object.create(null));

    expect(grouped).toEqual(expectedQuads);
  });
});
