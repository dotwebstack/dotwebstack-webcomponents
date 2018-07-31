import Resource from './Resource';
import { filter, find } from 'ramda';

export default class ResourceFinder {
  resources: Resource[];

  constructor(resources: Resource[]) {
    this.resources = resources;
  }

  find = (matcher: (resource: Resource) => boolean): Resource[] => {
    return filter(matcher, this.resources);
  }

  findOne = (matcher: (resource: Resource) => boolean): Resource | undefined => {
    return find(matcher, this.resources);
  }
}
