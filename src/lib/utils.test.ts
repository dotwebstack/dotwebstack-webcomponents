import { localName } from './utils';
import { namedNode } from '@rdfjs/data-model';

describe('utils::localName', () => {
  it('Returns the local name for hash URIs', () => {
    const result = localName(namedNode('http://foo#FooBar'));
    expect(result).toEqual('FooBar');
  });

  it('Returns the local name for slash URIs', () => {
    const result = localName(namedNode('http://foo/FooBar'));
    expect(result).toEqual('FooBar');
  });
});
