const mapChainsID = new Map([
    ['0x1', 'Ethereum Main Network (Mainnet)'],
    ['0x3', 'Ropsten Test Network'],
    ['0x4', 'Rinkeby Test Network'],
    ['0x5', 'Goerli Test Network'],
    ['0x2a', 'Kovan Test Network'],
    ['0x38', 'Binance Smart Chain'],
    ['0x89', 'Polygon ']
]);


export const getNameFromChainId = (chainId) => {
    const chainName = mapChainsID.get(chainId)
    if (chainName === undefined) {
        return "unknown network"
    }
    return chainName;
}