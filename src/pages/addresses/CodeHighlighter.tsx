import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-solidity'; 


export default ({ code, language }: {
    code: string,
    language: string
}) => {

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <pre className="source_code_shower">
            <code className={`language-${language}`} style={{width:"100%"}}>
                {code}
            </code>
        </pre>
    );

}