
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETWORK=$1
GENI_TOKEN_PATH=$(realpath ${SCRIPT_DIR}/../../geni_token)
GENI_AIRDROP_PATH=$(realpath $SCRIPT_DIR/..)

# cd ${GENI_TOKEN_PATH}
# npx hardhat run scripts/deploy.ether.js --network $NETWORK

cd ${GENI_AIRDROP_PATH}
npx hardhat run scripts/deploy_testnet_airdrop.js --network $NETWORK

cd ${GENI_TOKEN_PATH}
npx hardhat run scripts/transfer_to_testnet_airdrop.js --network $NETWORK



