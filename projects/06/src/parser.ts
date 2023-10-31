import { InstructionType, ParsedResultType } from './types'

export class Parser {
  public parse(line: string): ParsedResultType {
    const instruction = line.split('//')[0].trim()
    let parsedResult: ParsedResultType

    if (instruction === '') return null

    switch (instruction[0]) {
      case '@': {
        parsedResult = {
          type: InstructionType.AInstr,
          value: instruction.slice(1).trim(),
        }
        break
      }
      case '(': {
        const match = instruction.match(/(?<=\().*(?=\))/)
        parsedResult = match
          ? {
              type: InstructionType.Label,
              value: match[0],
            }
          : null
        break
      }
      default: {
        const [subInstruction, jump] = instruction.split(';').map((value) => value.trim())
        const [left, right] = subInstruction.split('=').map((value) => value.trim())

        parsedResult = {
          type: InstructionType.CInstr,
          value: instruction,
          comp: right || left,
          dest: !right ? null : left,
          jump: jump || null,
        }
        break
      }
    }
    return parsedResult
  }
}
