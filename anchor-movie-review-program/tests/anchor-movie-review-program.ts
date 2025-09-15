import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { expect } from 'chai';

describe("anchor-movie-review-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;

  const movie = {
    title: "Just a test movie",
    description: "Wow what a good movie it was real great",
    rating: 5,
  };

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId,
  );

  it("Movie review is added`", async () => {

    const tx = await program.methods.addMovieReview(
      movie.title,
      movie.description,
      movie.rating
    ).rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);

    expect(movie.title === account.title);
    expect(movie.rating === account.rating);
    expect(movie.description === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });

  it("Movie review is updated`", async () => {
    const updatedDescription = "Wow!! this is different";
    const updatedRating = 4;

    const tx = await program.methods.updateMovieReview(
      movie.title,
      updatedDescription,
      updatedRating
    ).rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);

    expect(movie.title === account.title);
    expect(updatedDescription === account.description);
    expect(updatedRating === account.rating);
    expect(account.reviewer === provider.wallet.publicKey);
  });

  it("Deletes a movie review", async () => {
    const tx = await program.methods.deleteMovieReview(movie.title).rpc()
   });
});