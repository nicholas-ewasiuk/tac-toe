# Solana Tic-Tac-Toe UI 
Basic front-end for the <a href="https://book.anchor-lang.com/">Anchor Book</a> Tic-Tac-Toe example.

Live version at <a href=https://tac-toe-omega.vercel.app>

<img src="/app/assets/tac-toe-home01.png" />
<img src="/app/assets/tac-toe-home02.png" />

## Running the app

Clone the repo, and run `yarn start`.

```bash
$ git clone https://github.com/nicholas-ewasiuk/tac-toe.git
$ cd tac-toe/app
$ yarn install
$ yarn start
```

The app points to a program already deployed on devnet. Replace the IDL file and TIC_TAC_TOE_ID pubkey in app/src/utils if deploying your own.

Navigate to `http://localhost:1234/` to explore the deployed application.

## Playing the game

Connect a wallet. Can create one using <a href=https://phantom.app>phantom.app</a> .

Request airdrop of SOL for fees. The app is set to "devnet" by default.

Click "Create New Game" button. 

Enter a friend's wallet address in the "Search Player Address" bar to see games they've created.

It is also possible to create and then join a game to play against oneself.

Play the game by clicking the square you want on your turn, submit the transaction. The square will update as soon as the transaction clears.

## Deploying and testing the Anchor program

Install the Anchor dependencies.

Follow the <a href="https://project-serum.github.io/anchor/getting-started/installation.html#install-rust">guide</a> here.

Run `anchor test`

Follow the <a href="https://book.anchor-lang.com/chapter_3/milestone_project_tic-tac-toe.html">guide</a> at the bottom of the page here to deploy on "devnet".

