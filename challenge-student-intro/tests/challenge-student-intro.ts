import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChallengeStudentIntro } from "../target/types/challenge_student_intro";
import { expect } from 'chai';

describe("challenge-student-intro", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .ChallengeStudentIntro as Program<ChallengeStudentIntro>;

  const student = {
    name: "Adnan",
    message: "Hey, Im into solana and coffee",
  };

  const [studentPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(student.name), provider.wallet.publicKey.toBuffer()],
    program.programId,
  );

  it("Student Intro is added`", async () => {

    const tx = await program.methods.addStudentIntro(
      student.name,
      student.message,
    ).rpc();

    const account = await program.account.introAccountState.fetch(studentPda);

    expect(student.name === account.name);
    expect(student.message === account.message);
    expect(account.student === provider.wallet.publicKey);
  });
  it("Student Intro is updated`", async () => {
    const updatedMessage = "Im into chess too";

    const tx = await program.methods.updateStudentIntro(
      student.name,
      updatedMessage
    ).rpc();

    const account = await program.account.introAccountState.fetch(studentPda);

    expect(student.name === account.name);
    expect(updatedMessage === account.message);
    expect(account.student === provider.wallet.publicKey);
  });
  it("Deletes a movie review", async () => {
    const tx = await program.methods.deleteStudentIntro(student.name).rpc()
   });
});
