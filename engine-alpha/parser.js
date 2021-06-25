const ast = require('./ast');

const ERROR_CODE = null;
const EMPTY_LINE = /^\s*$/;
const SPACE = /\s+/;

function parseInstruction(instruction) {
    if(instruction.match(EMPTY_LINE)) {
        return new ast.Skip();
    }
}

module.exports = {
    parseInstruction
}