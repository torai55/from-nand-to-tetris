import * as events from 'events'
import * as fs from 'node:fs'
import * as readline from 'readline'
import { Parser } from './parser'
import { Coder } from './coder'
import { SymbolTable } from './symbolTable'
import { InstructionType } from './types'

// Hack assembler translate Hack assembly programs(.asm)
// into executable Hack binary code(.hack)
// assumption: .asm file is error-free (no syntax error)

export class Assembler {
  public parser: Parser
  public coder: Coder
  public symbolTable: SymbolTable

  constructor(parser: Parser, coder: Coder, symbolTable: SymbolTable) {
    this.parser = parser
    this.coder = coder
    this.symbolTable = symbolTable
  }

  public async assemble(filePath: string, outPath?: string) {
    await this._firstPass(filePath)
    await this._secondPass(filePath, outPath)
  }

  private async _firstPass(filePath: string) {
    let counter = 0
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' })

    await this._readFile(readStream, (line) => {
      const parsedResult = this.parser.parse(line)
      if (!parsedResult) return
      if (parsedResult.type === InstructionType.Label) {
        this.symbolTable.add(parsedResult.value, counter.toString())
        return
      }
      counter++
    })
  }

  private async _secondPass(filePath: string, outPath?: string) {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' })
    const writeStream = fs.createWriteStream(outPath || filePath.replace(/.asm$/, '.hack'), { encoding: 'utf-8' })

    await this._readFile(readStream, (line) => {
      const parsedResult = this.parser.parse(line)
      if (!parsedResult || parsedResult.type === InstructionType.Label) {
        return
      } else if (parsedResult.type === InstructionType.AInstr) {
        parsedResult.value = this.symbolTable.find(parsedResult.value)
      }
      parsedResult.value = this.coder.encode(parsedResult)
      writeStream.write(parsedResult.value + '\n')
    })
  }

  private async _readFile(readStream: NodeJS.ReadableStream, lineProcessor: (line: string) => void) {
    try {
      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
      })
      rl.on('line', lineProcessor)
      await events.once(rl, 'close')
    } catch (e) {
      console.error(e)
    }
  }
}
