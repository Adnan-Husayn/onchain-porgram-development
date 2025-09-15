use anchor_lang::prelude::*;

declare_id!("C2ANPY2pB9uu3T4g1t5PFvfph244SwzimFx8P32W4FWn");

#[program]
pub mod challenge_student_intro {
    use super::*;

    pub fn add_student_intro(ctx: Context<AddStudentIntro>, name : String, message: String) -> Result<()> {

        let student_intro = &mut ctx.accounts.student_intro;
        student_intro.student = ctx.accounts.initializer.key();
        student_intro.name = name;
        student_intro.message = message;

        Ok(())
    }

    pub fn update_student_intro(ctx: Context<UpdateStudentIntro>, name : String, message: String) -> Result<()> {


        let student_intro = &mut ctx.accounts.student_intro;
        student_intro.name = name;
        student_intro.message = message;
        
        Ok(())
    }

    pub fn delete_student_intro(ctx: Context<DeleteStudentIntro>, name : String) -> Result<()> {
        msg!("Student Intro for {} deleted", name);
        Ok(())
    }
}


#[account]
#[derive(InitSpace)]
pub struct IntroAccountState {
    pub student : Pubkey,
    #[max_len(10)]
    pub name: String,
    #[max_len(50)]
    pub message: String,
}
const DISCRIMINATOR: usize = 8;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct AddStudentIntro<'info> {
    #[account(
        init,
        seeds = [name.as_bytes(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = DISCRIMINATOR + IntroAccountState::INIT_SPACE
    )]
    pub student_intro : Account<'info, IntroAccountState>,
    #[account(mut)]
    pub initializer : Signer<'info>,
    pub system_program : Program<'info, System>
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct UpdateStudentIntro<'info> {
    #[account(
        mut,
        seeds = [name.as_bytes(), initializer.key().as_ref()],
        bump,
        realloc = DISCRIMINATOR + IntroAccountState::INIT_SPACE,
        realloc::payer = initializer,
        realloc::zero = true
    )]
    pub student_intro : Account<'info, IntroAccountState>,
    #[account(mut)]
    pub initializer : Signer<'info>,
    pub system_program : Program<'info, System>
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DeleteStudentIntro<'info> {
    #[account(
        mut,
        seeds = [name.as_bytes(), initializer.key().as_ref()],
        bump,
        close = initializer
    )]
    pub student_intro : Account<'info, IntroAccountState>,
    #[account(mut)]
    pub initializer : Signer<'info>,
    pub system_program : Program<'info, System>
}