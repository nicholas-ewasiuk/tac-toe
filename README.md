# tac-toe
Basic front-end for the Project Serum <a href="https://book.anchor-lang.com/">Anchor Book</a> tic-tac-toe example. 

## Running the app

Clone the repo, and run `yarn start`.

```bash
$ git clone https://github.com/nicholas-ewasiuk/tac-toe.git
$ cd tac-toe/
$ yarn install
$ yarn start
```

The app points to a program already deployed on devnet. Replace the IDL file and TIC_TAC_TOE_ID pubkey in app/src/utils if deploying your own.

Navigate to `http://localhost:1234/` to explore the deployed application.

## Playing the game

Connect a wallet. Can create one using <a href=https://phantom.app>phantom.app</a> .

Request airdrop of SOL for transaction fees.

Click "Create Game" button. 

For testing on one's own, click Join Game. You are now player one and two.

To play against a friend. Have them enter the address under your "Current Game" into the "Load Game from Address" field.

Play the game by clicking the square you want on your turn, submit the transaction. The square will update as soon as the transaction clears.

## Deploying and testing the Anchor program

Install the Anchor dependencies.

Follow the <a href="https://project-serum.github.io/anchor/getting-started/installation.html#install-rust">guide</a> here.

Run `anchor test`

Follow the <a href="https://book.anchor-lang.com/chapter_3/milestone_project_tic-tac-toe.html">guide</a> at the bottom of the page here to deploy on "devnet".

