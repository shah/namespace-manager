import * as safety from "https://denopkg.com/shah/ts-safety@v0.3.1/mod.ts";
import type { TextValue } from "https://denopkg.com/shah/value-manager@v1.0.10/mod.ts";

export type NamespaceIdentifier = TextValue;
export type QualifiedNamespace = TextValue;

export interface Namespace {
  readonly isNamespace: true;
  readonly parent?: Namespace;
  readonly identifier: NamespaceIdentifier;
  readonly qualifiedName: QualifiedNamespace;
}

export const isNamespace = safety.typeGuard<Namespace>("isNamespace");

export class DefaultNamespace implements Namespace {
  readonly isNamespace: true = true;
  readonly qualifiedName: QualifiedNamespace;
  readonly pathDelimiter: string = ".";

  constructor(
    readonly identifier: NamespaceIdentifier,
    readonly parent?: Namespace,
  ) {
    if (this.parent) {
      this.qualifiedName = this.parent.qualifiedName + this.pathDelimiter +
        this.identifier;
    } else {
      this.qualifiedName = this.identifier;
    }
  }

  public namespace(
    identifier: NamespaceIdentifier,
    supplier?: (ns: DefaultNamespace) => void,
  ) {
    return namespaceFactory.namespace(identifier, this, supplier);
  }
}

export class NamespaceFactory {
  readonly root: Namespace = this.namespace("igs");
  readonly system: Namespace = this.namespace("system", this.root);
  readonly TODO: Namespace = this.namespace("TODO", this.root);

  constructor() {}

  namespace(
    identifier: NamespaceIdentifier,
    parent?: Namespace,
    supplier?: (ns: DefaultNamespace) => void,
  ): Namespace {
    const ns = new DefaultNamespace(identifier, this.root);
    if (supplier) supplier(ns);
    return ns;
  }
}

export const namespaceFactory = new NamespaceFactory();
