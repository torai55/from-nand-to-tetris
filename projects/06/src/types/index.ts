export enum InstructionType {
  AInstr = 'A-Instruction',
  CInstr = 'C-Instruction',
  Label = 'label',
}

export type ParsedResultType = AInstructionType | CInstructionType | LabelType | null

export type AInstructionType = {
  type: InstructionType.AInstr
  value: string
}

export type CInstructionType = {
  type: InstructionType.CInstr
  value: string
  comp: string
  dest: string | null
  jump: string | null
}

export type LabelType = {
  type: InstructionType.Label
  value: string
}
