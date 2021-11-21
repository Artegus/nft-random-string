import React from 'react'

const Account = ({
    account
}) => {

    const reduceLenghtAccount = () =>{
        let begin = account.substring(0, 4)
        let final = account.substring(account.length - 4)
        return `${begin}...${final}`;
    }

    return (
        <p className='account' title={account} >{account === undefined ? "Wallet not connected" : reduceLenghtAccount()}</p>
    )
}

export default Account
