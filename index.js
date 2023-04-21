const { ethers } = require('ethers');
const llamaAuctionHouseAbi = require('./llamaAuctionHouse.json');

// @NOTE: Replace the two placeholder values below
const provider = ethers.providers.getDefaultProvider('RPC_URL', 1);
const walletPrivateKey = 'PRIVATE_KEY';

const llamaAuctionHouse = '0xc5e5ca79d59c25a5f41e2aea4251f1c48419c2ab';
const llamaGnosisSafe = '0x73eb240a06f0e0747c698a219462059be6aaccc8';

async function run() {
    const wallet = new ethers.Wallet(walletPrivateKey, provider);
    const llamaAuctionHouseContract = new ethers.Contract(
        llamaAuctionHouse,
        llamaAuctionHouseAbi,
        wallet
    );

    overrides = {
        gasLimit: 500_000,
        gasPrice: ethers.utils.parseUnits('150', 'gwei').toString(),
        type: 1,
        accessList: [
            {
                // Gnosis Safe (receives ETH via `send`)
                address: llamaGnosisSafe,
                storageKeys: [
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                ],
            },
            {
                // Gnosis Safe singleton (retrieved from contract creation tx https://etherscan.io/tx/0x4a754ccfb1ec3de7a59710a2386245f9d4f6eca9cd1a55bc678a3cd771f67f75)
                address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
                storageKeys: [],
            },
        ],
    };

    const settlementTx =
        await llamaAuctionHouseContract.settle_current_and_create_new_auction(
            overrides
        );

    // Log the tx, and the recipient after 1 confirmation
    console.log(settlementTx);
    console.log(await settlementTx.wait(1));
}

run();
