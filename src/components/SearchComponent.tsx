
import { Input, Alert } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const { Search } = Input;
const { utils } = ethers;

interface SearchComponentProps {
    compact?: boolean;
    hero?: boolean;
}

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
            isTxHash = utils.hexValue(_input).length == 66 || utils.hexValue(_input).length == 65;
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

export default ({ compact = false, hero = false }: SearchComponentProps) => {
    const navigate = useNavigate();
    const [inputError, setInputError] = useState<string>();
    const [inputContent, setInputContent] = useState<string>();

    const handleInputSearch = (input: string) => {
        const {
            isBlockNumber, isAddress, isTxHash
        } = isValidInput(input);
        if (!isBlockNumber && !isAddress && !isTxHash) {
            setInputError("Please input valid Address Or Transaction Or BlockNumber");
            return;
        }
        setInputError("");
        setInputContent("");
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

    const searchStyle = hero
        ? { width: '100%', marginTop: 0, marginLeft: 0 }
        : compact
            ? { width: '100%', marginTop: 0, marginLeft: 0 }
            : { marginLeft: '40px', width: '80%', marginTop: '6px' };

    const alertStyle = hero
        ? { width: '100%', marginTop: '8px', marginLeft: 0 }
        : compact
            ? { width: '100%', marginTop: '6px', marginLeft: 0 }
            : { marginLeft: '40px', width: '80%', marginTop: '6px' };

    const wrapperClass = hero
        ? 'search-component-wrap search-component-hero'
        : 'search-component-wrap';

    return (
        <div className={wrapperClass}>
            <Search
                style={searchStyle}
                size={hero ? 'large' : compact ? 'middle' : 'large'}
                placeholder="Search by Address / Txn Hash / Block"
                enterButton
                onSearch={handleInputSearch}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
            />
            {inputError && (
                <Alert
                    style={alertStyle}
                    message={inputError}
                    type="error"
                    showIcon
                />
            )}
        </div>
    );
}