// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// screen: 256 * 512 pixel
// register: 256 * 512 / 16 = 8192
// SCREEN[0] ~ SCREEN[8191] need to be black

// pseudo code:

// kbd = 0
// scn_addr = SCREEN
// scn_length = 8192
// i = 0

// while (true) {
//   if (kbd === KBD[0]) {
//     continue
//   }
//   kbd = KBD[0]
// 
//   for (i=0; i<scn_length; i++) {
//     if (kbd !== 0) {
//       scn_addr[i] = -1 // (∵ 16-bit 2'complement -1 = 1111 1111 1111 1111)
//     } else {
//       scn_addr[i] = 0
//     }
//   }
// }

@kbd
M=0

@SCREEN
D=A
@scn_addr
M=D

@8192
D=A
@scn_length
M=D

@i
M=0

(INPUT_LOOP)
  @kbd
  D=M
  @KBD
  D=D-M
  @INPUT_LOOP
  D;JEQ

  @KBD
  D=M
  @kbd
  M=D

  @i
  M=0

  (SCREEN_LOOP)
    @i
    D=M
    @scn_length
    D=M-D
    @INPUT_LOOP
    D;JLE

    @kbd
    D=M
    @SET_SCREEN_BLACK
    D;JNE

    @SET_SCREEN_WHITE
    0;JMP

    (SET_SCREEN_BLACK)
      @i
      D=M
      @scn_addr
      A=M+D
      M=-1
      
      @i
      M=M+1

      @SCREEN_LOOP
      0;JMP
    
    (SET_SCREEN_WHITE)
      @i
      D=M
      @scn_addr
      A=M+D
      M=0
      
      @i
      M=M+1

      @SCREEN_LOOP
      0;JMP

  @INPUT_LOOP
  0;JMP
