# tictactoe-ui
Basic front-end for the Project Serum Anchor Book tic-tac-toe example. 

## Deploying and testing the Anchor program

Install the Anchor dependencies.

Follow the <a href="https://project-serum.github.io/anchor/getting-started/installation.html#install-rust">guide</a> here.

Run `anchor test`

Follow the <a href="https://book.anchor-lang.com/chapter_3/milestone_project_tic-tac-toe.html">guide</a> at the bottom of the page here to deploy on "devnet".

## Running the app

Clone the repo, and run `yarn start`.

```bash
$ git clone https://github.com/nicholas-ewasiuk/tictactoe-ui.git
$ cd tictactoe-ui/app
$ yarn install
$ yarn start
```

The app points to a program already deployed on devnet. Replace the IDL file and TIC_TAC_TOE_ID pubkey in app/src/utils if deploying your own.

Navigate to `http://localhost:1234/` to explore the deployed application.

## Playing the game

Connect a wallet. Phantom is suggested.

Request airdrop.

Click create game button. 

For testing on one's own, click Join Game. You are now player one and two.

To play against a friend. Have them deploy the app and copy paste the address of your current game into the join game by address field.

Play the game by clicking the square you want on your turn, submit the transaction. The square will update as soon as the transaction clears.