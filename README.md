# Solana Tic-Tac-Toe UI 
Basic front-end for the <a href="https://book.anchor-lang.com/">Anchor Book</a> Tic-Tac-Toe example using Goki Protocol WalletKit and Saber HQ use-solana

Live version at <a href=https://tac-toe-omega.vercel.app>tac-toe-omega.vercel.app</a>

<img src="/app/assets/tac-toe-home01.png" />

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

Connect a wallet and request airdrop of SOL for fees. The app is set to "devnet" by default.

Click "Create New Game" button. 

Get your friends into crypto by forcing them to play with Tic-Tac-Toe with you!

Have them enter your address in the "Search Player Address" bar to see games you've created. Hit join on the game you want.

You can also join your own game and play by yourself.

Play the game by clicking the square you want on your turn, submit the transaction. The square will update as soon as the transaction clears.

## Deploying and testing the Anchor program

Install the Anchor dependencies.

Follow the <a href="https://project-serum.github.io/anchor/getting-started/installation.html#install-rust">guide</a> here.

Run `anchor test`

Follow the <a href="https://book.anchor-lang.com/chapter_3/milestone_project_tic-tac-toe.html">guide</a> at the bottom of the page here to deploy on "devnet".

