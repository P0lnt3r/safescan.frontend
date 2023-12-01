
export const CompileTypeOptions = [
    { value: '', label: '[Please Select]' },
    { value: 'Solidity(Single File)', label: 'Solidity(Single File)' },
    { value: 'Solidity(Standard-Json-Input)', label: 'Solidity(Standard-Json-Input)' },
]

export const LicenseOptions = [
    { value: '', label: '[Please Select]' },
    { value: 'None', label: '1) No License (None)' },
    { value: 'Unlicense', label: '2) The Unlicense (Unlicense)' },
    { value: 'MIT', label: '3) MIT License (MIT)' },
    { value: 'GNU GPLv2', label: '4) GNU General Public License v2.0 (GNU GPLv2)' },
    { value: 'GNU GPLv3', label: '5) GNU General Public License v3.0 (GNU GPLv3)' },
    { value: 'GNU LGPLv2.1', label: '6) GNU Lesser General Public License v2.1 (GNU LGPLv2.1)' },
    { value: 'GNU LGPLv3', label: '7) GNU Lesser General Public License v3.0 (GNU LGPLv3)' },
    { value: 'BSD-2-Clause', label: '8) BSD 2-clause "Simplified" license (BSD-2-Clause)' },
    { value: 'BSD-3-Clause', label: '9) BSD 3-clause "New" Or "Revised" license (BSD-3-Clause)' },
    { value: 'MPL-2.0', label: '10) Mozilla Public License 2.0 (MPL-2.0)' },
    { value: 'OSL-3.0', label: '11) Open Software License 3.0 (OSL-3.0)' },
    { value: 'Apache-2.0', label: '12) Apache 2.0 (Apache-2.0)' },
    { value: 'GNU AGPLv3', label: '13) GNU Affero General Public License (GNU AGPLv3)' },
    { value: 'BSL 1.1', label: '14) Business Source License (BSL 1.1)' }
]

export const EvmVersionOptions = [
    { value: "", label: "default (compiler defaults)" },
    { value: "homestead", label: "homestead (oldest version)" },
    { value: "tangerineWhistle", label: "tangerineWhistle" },
    { value: "spuriousDragon", label: "spuriousDragon" },
    { value: "byzantium", label: "byzantium (default for >= v0.5.4)" },
    { value: "constantinople", label: "constantinople" },
    { value: "petersburg", label: "petersburg (default for >= v0.5.5)" },
    { value: "istanbul", label: "istanbul (default for >= v0.5.14)" },
    { value: "berlin", label: "berlin (default for >= v0.8.5)" },
    { value: "london", label: "london (default for >= v0.8.7)" },
    { value: "paris", label: "paris (default for >=v0.8.18)" },
    { value: "shanghai", label: "shanghai (default for >=v0.8.20)" }
]

export const SolcCompileVersionOptions = [
    { value: '', label: '[Please Select]' },
    {
        value: 'v0.8.22+commit.4fc1097e',
        label: 'v0.8.22+commit.4fc1097e'
    },
    {
        value: 'v0.8.21+commit.d9974bed',
        label: 'v0.8.21+commit.d9974bed'
    },
    {
        value: 'v0.8.20+commit.a1b79de6',
        label: 'v0.8.20+commit.a1b79de6'
    },
    {
        value: 'v0.8.19+commit.7dd6d404',
        label: 'v0.8.19+commit.7dd6d404'
    },
    {
        value: 'v0.8.18+commit.87f61d96',
        label: 'v0.8.18+commit.87f61d96'
    },
    {
        value: 'v0.8.17+commit.8df45f5f',
        label: 'v0.8.17+commit.8df45f5f'
    },
    {
        value: 'v0.8.16+commit.07a7930e',
        label: 'v0.8.16+commit.07a7930e'
    },
    {
        value: 'v0.8.15+commit.e14f2714',
        label: 'v0.8.15+commit.e14f2714'
    },
    {
        value: 'v0.8.14+commit.80d49f37',
        label: 'v0.8.14+commit.80d49f37'
    },
    {
        value: 'v0.8.13+commit.abaa5c0e',
        label: 'v0.8.13+commit.abaa5c0e'
    },
    {
        value: 'v0.8.12+commit.f00d7308',
        label: 'v0.8.12+commit.f00d7308'
    },
    {
        value: 'v0.8.11+commit.d7f03943',
        label: 'v0.8.11+commit.d7f03943'
    },
    {
        value: 'v0.8.10+commit.fc410830',
        label: 'v0.8.10+commit.fc410830'
    },
    { value: 'v0.8.9+commit.e5eed63a', label: 'v0.8.9+commit.e5eed63a' },
    { value: 'v0.8.8+commit.dddeac2f', label: 'v0.8.8+commit.dddeac2f' },
    { value: 'v0.8.7+commit.e28d00a7', label: 'v0.8.7+commit.e28d00a7' },
    { value: 'v0.8.6+commit.11564f7e', label: 'v0.8.6+commit.11564f7e' },
    { value: 'v0.8.5+commit.a4f2e591', label: 'v0.8.5+commit.a4f2e591' },
    { value: 'v0.8.4+commit.c7e474f2', label: 'v0.8.4+commit.c7e474f2' },
    { value: 'v0.8.3+commit.8d00100c', label: 'v0.8.3+commit.8d00100c' },
    { value: 'v0.8.2+commit.661d1103', label: 'v0.8.2+commit.661d1103' },
    { value: 'v0.8.1+commit.df193b15', label: 'v0.8.1+commit.df193b15' },
    { value: 'v0.8.0+commit.c7dfd78e', label: 'v0.8.0+commit.c7dfd78e' },
    { value: 'v0.7.6+commit.7338295f', label: 'v0.7.6+commit.7338295f' },
    { value: 'v0.7.5+commit.eb77ed08', label: 'v0.7.5+commit.eb77ed08' },
    { value: 'v0.7.4+commit.3f05b770', label: 'v0.7.4+commit.3f05b770' },
    { value: 'v0.7.3+commit.9bfce1f6', label: 'v0.7.3+commit.9bfce1f6' },
    { value: 'v0.7.2+commit.51b20bc0', label: 'v0.7.2+commit.51b20bc0' },
    { value: 'v0.7.1+commit.f4a555be', label: 'v0.7.1+commit.f4a555be' },
    { value: 'v0.7.0+commit.9e61f92b', label: 'v0.7.0+commit.9e61f92b' },
    {
        value: 'v0.6.12+commit.27d51765',
        label: 'v0.6.12+commit.27d51765'
    },
    {
        value: 'v0.6.11+commit.5ef660b1',
        label: 'v0.6.11+commit.5ef660b1'
    },
    {
        value: 'v0.6.10+commit.00c0fcaf',
        label: 'v0.6.10+commit.00c0fcaf'
    },
    { value: 'v0.6.9+commit.3e3065ac', label: 'v0.6.9+commit.3e3065ac' },
    { value: 'v0.6.8+commit.0bbfe453', label: 'v0.6.8+commit.0bbfe453' },
    { value: 'v0.6.7+commit.b8d736ae', label: 'v0.6.7+commit.b8d736ae' },
    { value: 'v0.6.6+commit.6c089d02', label: 'v0.6.6+commit.6c089d02' },
    { value: 'v0.6.5+commit.f956cc89', label: 'v0.6.5+commit.f956cc89' },
    { value: 'v0.6.4+commit.1dca32f3', label: 'v0.6.4+commit.1dca32f3' },
    { value: 'v0.6.3+commit.8dda9521', label: 'v0.6.3+commit.8dda9521' },
    { value: 'v0.6.2+commit.bacdbe57', label: 'v0.6.2+commit.bacdbe57' },
    { value: 'v0.6.1+commit.e6f7d5a4', label: 'v0.6.1+commit.e6f7d5a4' },
    { value: 'v0.6.0+commit.26b70077', label: 'v0.6.0+commit.26b70077' },
    {
        value: 'v0.5.17+commit.d19bba13',
        label: 'v0.5.17+commit.d19bba13'
    },
    {
        value: 'v0.5.16+commit.9c3226ce',
        label: 'v0.5.16+commit.9c3226ce'
    },
    {
        value: 'v0.5.15+commit.6a57276f',
        label: 'v0.5.15+commit.6a57276f'
    },
    {
        value: 'v0.5.14+commit.01f1aaa4',
        label: 'v0.5.14+commit.01f1aaa4'
    },
    {
        value: 'v0.5.13+commit.5b0b510c',
        label: 'v0.5.13+commit.5b0b510c'
    },
    {
        value: 'v0.5.12+commit.7709ece9',
        label: 'v0.5.12+commit.7709ece9'
    },
    {
        value: 'v0.5.11+commit.c082d0b4',
        label: 'v0.5.11+commit.c082d0b4'
    },
    {
        value: 'v0.5.10+commit.5a6ea5b1',
        label: 'v0.5.10+commit.5a6ea5b1'
    },
    { value: 'v0.5.9+commit.e560f70d', label: 'v0.5.9+commit.e560f70d' },
    { value: 'v0.5.8+commit.23d335f2', label: 'v0.5.8+commit.23d335f2' },
    { value: 'v0.5.7+commit.6da8b019', label: 'v0.5.7+commit.6da8b019' },
    { value: 'v0.5.6+commit.b259423e', label: 'v0.5.6+commit.b259423e' },
    { value: 'v0.5.5+commit.47a71e8f', label: 'v0.5.5+commit.47a71e8f' },
    { value: 'v0.5.4+commit.9549d8ff', label: 'v0.5.4+commit.9549d8ff' },
    { value: 'v0.5.3+commit.10d17f24', label: 'v0.5.3+commit.10d17f24' },
    { value: 'v0.5.2+commit.1df8f40c', label: 'v0.5.2+commit.1df8f40c' },
    { value: 'v0.5.1+commit.c8a2cb62', label: 'v0.5.1+commit.c8a2cb62' },
    { value: 'v0.5.0+commit.1d4f565a', label: 'v0.5.0+commit.1d4f565a' },
    {
        value: 'v0.4.26+commit.4563c3fc',
        label: 'v0.4.26+commit.4563c3fc'
    },
    {
        value: 'v0.4.25+commit.59dbf8f1',
        label: 'v0.4.25+commit.59dbf8f1'
    },
    {
        value: 'v0.4.24+commit.e67f0147',
        label: 'v0.4.24+commit.e67f0147'
    },
    {
        value: 'v0.4.23+commit.124ca40d',
        label: 'v0.4.23+commit.124ca40d'
    },
    {
        value: 'v0.4.22+commit.4cb486ee',
        label: 'v0.4.22+commit.4cb486ee'
    },
    {
        value: 'v0.4.21+commit.dfe3193c',
        label: 'v0.4.21+commit.dfe3193c'
    },
    {
        value: 'v0.4.20+commit.3155dd80',
        label: 'v0.4.20+commit.3155dd80'
    },
    {
        value: 'v0.4.19+commit.c4cbbb05',
        label: 'v0.4.19+commit.c4cbbb05'
    },
    {
        value: 'v0.4.18+commit.9cf6e910',
        label: 'v0.4.18+commit.9cf6e910'
    },
    {
        value: 'v0.4.17+commit.bdeb9e52',
        label: 'v0.4.17+commit.bdeb9e52'
    },
    {
        value: 'v0.4.16+commit.d7661dd9',
        label: 'v0.4.16+commit.d7661dd9'
    },
    {
        value: 'v0.4.15+commit.bbb8e64f',
        label: 'v0.4.15+commit.bbb8e64f'
    },
    {
        value: 'v0.4.14+commit.c2215d46',
        label: 'v0.4.14+commit.c2215d46'
    },
    {
        value: 'v0.4.13+commit.0fb4cb1a',
        label: 'v0.4.13+commit.0fb4cb1a'
    },
    {
        value: 'v0.4.12+commit.194ff033',
        label: 'v0.4.12+commit.194ff033'
    },
    {
        value: 'v0.4.11+commit.68ef5810',
        label: 'v0.4.11+commit.68ef5810'
    },
    {
        value: 'v0.4.10+commit.f0d539ae',
        label: 'v0.4.10+commit.f0d539ae'
    },
    { value: 'v0.4.9+commit.364da425', label: 'v0.4.9+commit.364da425' },
    { value: 'v0.4.8+commit.60cc1668', label: 'v0.4.8+commit.60cc1668' },
    { value: 'v0.4.7+commit.822622cf', label: 'v0.4.7+commit.822622cf' },
    { value: 'v0.4.6+commit.2dabbdf0', label: 'v0.4.6+commit.2dabbdf0' },
    { value: 'v0.4.5+commit.b318366e', label: 'v0.4.5+commit.b318366e' },
    { value: 'v0.4.4+commit.4633f3de', label: 'v0.4.4+commit.4633f3de' },
    { value: 'v0.4.3+commit.2353da71', label: 'v0.4.3+commit.2353da71' },
    { value: 'v0.4.2+commit.af6afb04', label: 'v0.4.2+commit.af6afb04' },
    { value: 'v0.4.1+commit.4fc6fc2c', label: 'v0.4.1+commit.4fc6fc2c' },
    { value: 'v0.4.0+commit.acd334c9', label: 'v0.4.0+commit.acd334c9' }
]