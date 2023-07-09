
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { Menu, Row, Col, Button, Layout, Input } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';
import { Alert, Space } from 'antd';
import { useNavigate } from 'react-router';

const { Search } = Input;
const { utils } = ethers;

const isValidInput = (input: string): {
    isBlockNumber: boolean,
    isAddress: boolean,
    isTxHash: boolean
} => {
    let isBlockNumber = false, isAddress = false, isTxHash = false;
    if (input) {
        let _input = input.toLocaleLowerCase();
        if (_input.startsWith('0x') && utils.isHexString(_input)) {
            isAddress = utils.isAddress(_input);
            isTxHash = utils.hexValue(_input).length == 66;
        } else {
            try {
                if (parseInt(input, 10) == parseFloat(input)) {
                    isBlockNumber = parseInt(input) >= 0;
                }
            } catch (e) {
                isBlockNumber = false;
            }
        }
    }
    return {
        isBlockNumber, isAddress, isTxHash
    }
}

export default () => {
    const navigate = useNavigate();
    const [inputError, setInputError] = useState<string>();

    const handleInputSearch = (input: string) => {
        const {
            isBlockNumber, isAddress, isTxHash
        } = isValidInput(input);
        if (!isBlockNumber && !isAddress && !isTxHash) {
            setInputError("Please input valid Address Or Transaction Or BlockNumber");
            return;
        }
        setInputError("");
        if (isBlockNumber) {
            navigate(`/block/${input}`)
        }
        if (isAddress) {
            navigate(`/address/${input.toLocaleLowerCase()}`)
        }
        if (isTxHash) {
            navigate(`/tx/${input.toLocaleLowerCase()}`)
        }
    }

    return <>
        <Search style={{ marginLeft: '40px', width: '80%', marginTop: '6px' }}
            size='large'
            placeholder="Input Address/TxHash" enterButton
            onSearch={handleInputSearch}
        />
        {
            inputError &&
            <Alert style={{ marginLeft: '40px', width: '80%', marginTop: '6px' }}
                message={inputError}
                type="error"
                showIcon
            />
        }
    </>

}