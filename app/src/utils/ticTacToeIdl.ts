import { Idl } from "@project-serum/anchor";

export const ticTacToeIdl: Idl = {
  "version": "0.1.0",
  "name": "tac_toe",
  "instructions": [
    {
      "name": "setupGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerOne",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "playerJoin",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerTwo",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "tile",
          "type": {
            "defined": "Tile"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                "publicKey",
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "array": [
                {
                  "array": [
                    {
                      "option": {
                        "defined": "Sign"
                      }
                    },
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Tie"
          },
          {
            "name": "Won",
            "fields": [
              {
                "name": "winner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Sign",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "X"
          },
          {
            "name": "O"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TileOutOfBounds"
    },
    {
      "code": 6001,
      "name": "TileAlreadySet"
    },
    {
      "code": 6002,
      "name": "GameAlreadyOver"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn"
    }
  ],
}