import { NamedNode, Term, BlankNode, Quad } from 'rdf-js';
import { statementsWithPredicate, uniquePredicates } from '../components/Resource.utils';
import { Row, Property, PropertyPath } from '../components/Resource';
import Store from './Store';

export default class PropertyStore {

  // TODO some of this can be replaced by store.filter(), store.subjects(), ...

  private readonly statements: Quad[];
  private readonly statementsWhereObject: Quad[];

  constructor(readonly resource: NamedNode | BlankNode, readonly store: Store) {
    this.statements = store.findStatements(resource);
    this.statementsWhereObject = store.findStatementsWithObject(resource);
  }

  private getRegularPropertyValues(predicate: NamedNode): Term[] {
    return statementsWithPredicate(this.statements, predicate)
      .map(statement => statement.object);
  }

  private getInversePropertyValues(predicate: NamedNode): Term[] {
    return statementsWithPredicate(this.statementsWhereObject, predicate)
      .map(statement => statement.subject);
  }

  private getPropertyValues(predicate: NamedNode, inverse: boolean): Term[] {
    return inverse
      ? this.getInversePropertyValues(predicate)
      : this.getRegularPropertyValues(predicate);
  }

  getPropertiesForRows(rows: Row[]): Property[] {
    return rows.map((row): Property => {
      const { predicate } = row;
      const inverse = !!row.inverse;
      const values = this.getPropertyValues(predicate, inverse);
      return {
        values,
        path: { predicate, inverse },
        label: row.label,
        customRender: row.customRender,
      };
    });
  }

  getProperties(inverse: boolean, filter: (path: PropertyPath) => boolean): Property[] {
    return uniquePredicates(inverse ? this.statementsWhereObject : this.statements)
      .map((predicate): PropertyPath => ({ predicate, inverse }))
      .filter(filter)
      .map(path => ({ path, values: this.getPropertyValues(path.predicate, inverse) }));
  }
}
