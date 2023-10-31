import { CInstructionType, AInstructionType, InstructionType } from './types'

export class Coder {
  private _compMap = {
    '0': '101010',
    '1': '111111',
    '-1': '111010',
    D: '001100',
    A: '110000',
    '!D': '001101',
    '!A': '110001',
    '-D': '001111',
    '-A': '110011',
    'D+1': '011111',
    'A+1': '110111',
    'D-1': '001110',
    'A-1': '110010',
    'D+A': '000010',
    'D-A': '010011',
    'A-D': '000111',
    'D&A': '000000',
    'D|A': '010101',
  }
  private _destMap = {
    empty: '000',
    M: '001',
    D: '010',
    MD: '011',
    A: '100',
    AM: '101',
    AD: '110',
    AMD: '111',
  }
  private _jumpMap = {
    empty: '000',
    JGT: '001',
    JEQ: '010',
    JGE: '011',
    JLT: '100',
    JNE: '101',
    JLE: '110',
    JMP: '111',
  }

  public encode(parsedResult: AInstructionType | CInstructionType) {
    let result = ''

    switch (parsedResult.type) {
      case InstructionType.AInstr: {
        result = Number(parsedResult.value).toString(2).padStart(16, '0')
        break
      }
      case InstructionType.CInstr: {
        const code = this._encodeComp(parsedResult.comp) + this._encodeDest(parsedResult.dest) + this._encodeJump(parsedResult.jump)
        result = code.padStart(16, '1')
        break
      }
      default: {
        break
      }
    }
    return result
  }

  private _encodeComp(comp: string) {
    const addressCode = /M/.test(comp) ? '1' : '0'
    const compKey = comp.replace('M', 'A')
    if (!Object.keys(this._compMap).includes(compKey)) {
      throw new Error(`comp ${comp} not exists`)
    }
    const compCode = this._compMap[compKey as keyof typeof this._compMap]
    return addressCode + compCode
  }

  private _encodeDest(dest: string | null) {
    if (!dest) return this._destMap['empty']
    if (!Object.keys(this._destMap).includes(dest)) {
      throw new Error(`dest ${dest} not exists`)
    }
    return this._destMap[dest as keyof typeof this._destMap]
  }

  private _encodeJump(jump: string | null) {
    if (!jump) return this._jumpMap['empty']
    if (!Object.keys(this._jumpMap).includes(jump)) {
      throw new Error(`jump ${jump} not exists`)
    }
    return this._jumpMap[jump as keyof typeof this._jumpMap]
  }
}
