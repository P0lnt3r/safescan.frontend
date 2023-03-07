
import { useNavigate } from 'react-router-dom';


export default ({ path, children }: { path: string, children: any }) => {
    const navigate = useNavigate();
    return (
        <a href={path} onClick={ (event) => { 
            navigate(path) ;
            event.preventDefault();
        }}>
            {children}
        </a>
    )
}