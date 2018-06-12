class Vocab {
  readonly properties: string[];
  readonly values: Map<string, {link: string, label: string}[]>;

  constructor(
    readonly link: string,
    readonly title: string,
    readonly description: string,
    ) {
    this.values = new Map();
    this.properties = [];
  }

  public add(name: string, values: {link: string, label: string}[]) {
    this.values.set(name, values);
    this.properties.push(name);
  }

  public getProperty(key: string) : {link: string, label: string}[] {
    return this.values.get(key) || [];
  }
}

export default Vocab;
