import {State} from './environment';
import {Ok} from './status';

export type Argument = Operandum | Label;

export class Operandum {
  constructor(public value: bigint) {}
}

export class Const extends Operandum {}
export class Address extends Operandum {}
export class Reference extends Operandum {}

export class Label {
  constructor(public value: string) {}
}

export type Instruction =
  | Load
  | Store
  | Add
  | Sub
  | Mult
  | Div
  | Read
  | Write
  | Jump
  | Jgtz
  | Jzero
  | Halt
  | Skip
  | Combine;

interface Interpreter {
  interp: (state: State) => Ok;
  prettyPrint: () => {name: string; argument: string};
}

export class Load implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'load', argument: arg};
  }
}

export class Store implements Interpreter {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'store', argument: arg};
  }
}

export class Add implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'add', argument: arg};
  }
}

export class Sub implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'sub', argument: arg};
  }
}

export class Mult implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'mult', argument: arg};
  }
}

export class Div implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      case Reference:
        arg = '^' + arg;
        break;
      default:
        break;
    }
    return {name: 'div', argument: arg};
  }
}

export class Read implements Interpreter {
  constructor(public argument: Address | Reference) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      default:
        break;
    }
    return {name: 'read', argument: arg};
  }
}

export class Write implements Interpreter {
  constructor(public argument: Operandum) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    let arg = this.argument.value.toString();
    switch (this.argument.constructor) {
      case Const:
        arg = '=' + arg;
        break;
      default:
        break;
    }
    return {name: 'write', argument: arg};
  }
}

export class Jump implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    const arg = this.argument.value;
    return {name: 'jump', argument: arg};
  }
}

export class Jgtz implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    const arg = this.argument.value;
    return {name: 'jgtz', argument: arg};
  }
}

export class Jzero implements Interpreter {
  constructor(public argument: Label) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    const arg = this.argument.value;
    return {name: 'jzero', argument: arg};
  }
}

export class Halt implements Interpreter {
  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: 'halt', argument: ''};
  }
}
export class Skip implements Interpreter {
  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return {name: '', argument: ''};
  }
}

export class Combine implements Interpreter {
  constructor(
    public instruction: Instruction,
    public nextInstruction: Instruction
  ) {}

  interp!: (state: State) => Ok;
  prettyPrint(): {name: string; argument: string} {
    return this.instruction.prettyPrint();
  }
}

export class Program {
  constructor(
    public labels: Map<string, Instruction>,
    public programTree: Instruction
  ) {}
}
