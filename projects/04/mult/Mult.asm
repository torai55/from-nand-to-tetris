// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// pseudo code:

// result = 0
// multiplicand = RAM[0]
// multiplier = RAM[1]
// i = 0

// for (i=0; i<multiplier; i++) {
//   result+=multiplicand
// }
// RAM[2] = result

  @result
  M=0

  @R0
  D=M
  @multiplicand
  M=D

  @R1
  D=M
  @multiplier
  M=D

  @i
  M=0

(LOOP)
  @i
  D=M
  @multiplier
  D=D-M
  @OUT
  D;JGE

  @multiplicand
  D=M
  @result
  M=D+M

  @i
  M=M+1
  @LOOP
  0;JMP

(OUT)
  @result
  D=M
  @R2
  M=D
  @END
  0;JMP

(END)
  @END
  0;JMP
