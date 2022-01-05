export class Ok {
  modifiedRegister!: bigint | undefined;
  constructor(modifiedRegister: bigint | undefined = undefined) {
    this.modifiedRegister = modifiedRegister;
  }
}

export class Break {
  modifiedRegister!: bigint | undefined;
  constructor(modifiedRegister: bigint | undefined = undefined) {
    this.modifiedRegister = modifiedRegister;
  }
}
