import { program } from 'commander'
import { Assembler } from './assembler'
import { Parser } from './parser'
import { Coder } from './coder'
import { SymbolTable } from './symbolTable'

program
  .version('0.0.1')
  .summary('assemble')
  .description('translate .asm into .hack file')
  .requiredOption('-f, --file <filePath>', 'need a file for translation')
  .option('-o, --output', 'machine code dest')

program.parse()

const options = program.opts()
const assembler = new Assembler(new Parser(), new Coder(), new SymbolTable())

assembler.assemble(options.file, options.output)
