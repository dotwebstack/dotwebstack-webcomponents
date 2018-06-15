class Concept {
  readonly properties: string[];
  readonly values: {
    [key: string]: {link: string, label: string}[];
  };

  constructor(
    readonly link: string,
    readonly title: string,
    readonly description: string,
    ) {
    this.values = {};
    this.properties = [];
  }

  public add(name: string, values: {link: string, label: string}[]) {
    this.values[name] = values;
    this.properties.push(name);
  }

  public getProperty(key: string) : {link: string, label: string}[] {
    return this.values[key] || [];
  }
}

export default Concept;
