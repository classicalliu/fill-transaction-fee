# Fill Transaction Fee

## Install dependencies

```bash
yarn
```

## ENV properties

`CKB_RPC` => ckb rpc address, default to `http://localhost:8114`

`IDEXER_PATH` => indexer data path, default to `./indexer-data`

`PORT` => server port, default to `8888` 

## Start

```bash
# build before run
yarn build

LUMOS_CONFIG_FILE=<your lumos config file> yarn run start
# OR
LUMOS_CONFIG_NAME=AGGRON4 yarn run start
```

## Methods

### pay_fee

```
{
    "id": 1,
    "jsonrpc": "2.0",
    "method": "pay_fee",
    "params": [TransactionSkeleton, LockScript, FeeRate]
}
```

## Examples

request

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "pay_fee",
  "params": [
    {
      "cell_deps": [
        {
          "out_point": {
            "tx_hash": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
            "index": "0x0"
          },
          "dep_type": "dep_group"
        }
      ],
      "inputs": [
        {
          "input": {
            "previous_output": {
              "tx_hash": "0x490f4c97a0454fbc2376ec322e38650004098b1dda1edabd5021ad0a607d855d",
              "index": "0x0"
            },
            "since": "0x0"
          },
          "cell": {
            "out_point": {
              "tx_hash": "0x490f4c97a0454fbc2376ec322e38650004098b1dda1edabd5021ad0a607d855d",
              "index": "0x0"
            },
            "output": {
              "capacity": "0x12474d163d07",
              "lock": {
                "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "hash_type": "type",
                "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
              }
            },
            "data": "0x"
          }
        }
      ],
      "cell_outputs": [
        [
          {
            "capacity": "0x174876e800",
            "lock": {
              "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
              "hash_type": "type",
              "args": "0xe2193df51d78411601796b35b17b4f8f2cd85bd0"
            }
          },
          "0x"
        ],
        [
          {
            "capacity": "0x1230049f5507",
            "lock": {
              "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
              "hash_type": "type",
              "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
            }
          },
          "0x"
        ]
      ],
      "witnesses": [
        {
          "lock": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        }
      ]
    },
    {
      "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "hash_type": "type",
      "args": "0x36c329ed630d6ce750712a477543672adab57f4c",
    },
    "1000"
  ]
}
```

response

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "cell_deps": [
            {
                "out_point": {
                    "tx_hash": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
                    "index": "0x0"
                },
                "dep_type": "dep_group"
            }
        ],
        "inputs": [
            {
                "input": {
                    "previous_output": {
                        "tx_hash": "0x490f4c97a0454fbc2376ec322e38650004098b1dda1edabd5021ad0a607d855d",
                        "index": "0x0"
                    },
                    "since": "0x0"
                },
                "cell": {
                    "out_point": {
                        "tx_hash": "0x490f4c97a0454fbc2376ec322e38650004098b1dda1edabd5021ad0a607d855d",
                        "index": "0x0"
                    },
                    "output": {
                        "capacity": "0x12474d163d07",
                        "lock": {
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type",
                            "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
                        }
                    },
                    "data": "0x"
                }
            },
            {
                "input": {
                    "previous_output": {
                        "tx_hash": "0xf5a43129ccd43bec21025c16e2b52dc0e582fdd13a7d9bfefbd7fd3df78e9ee3",
                        "index": "0x0"
                    },
                    "since": "0x0"
                },
                "cell": {
                    "out_point": {
                        "tx_hash": "0xf5a43129ccd43bec21025c16e2b52dc0e582fdd13a7d9bfefbd7fd3df78e9ee3",
                        "index": "0x0"
                    },
                    "output": {
                        "capacity": "0x12474cace059",
                        "lock": {
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type",
                            "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
                        }
                    },
                    "data": "0x"
                }
            }
        ],
        "cell_outputs": [
            [
                {
                    "capacity": "0x174876e800",
                    "lock": {
                        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                        "hash_type": "type",
                        "args": "0xe2193df51d78411601796b35b17b4f8f2cd85bd0"
                    }
                },
                "0x"
            ],
            [
                {
                    "capacity": "0x1230049f5507",
                    "lock": {
                        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                        "hash_type": "type",
                        "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
                    }
                },
                "0x"
            ],
            [
                {
                    "capacity": "0x12474cacdde8",
                    "lock": {
                        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                        "hash_type": "type",
                        "args": "0x36c329ed630d6ce750712a477543672adab57f4c"
                    }
                },
                "0x"
            ]
        ],
        "witnesses": [
            {
                "lock": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            },
            {
                "lock": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
        ]
    }
}
```