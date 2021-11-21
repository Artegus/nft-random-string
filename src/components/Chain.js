import React from 'react'
import { getNameFromChainId } from '../utils/chainsId'

const Chain = ({
    chainId
}) => {
    return (
        <p>
            {getNameFromChainId(chainId)}
        </p>
    )
}

export default Chain
