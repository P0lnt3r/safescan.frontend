import format from 'date-fns/format';

export function DateFormat( time : number | undefined ) : string {
    if ( time ){
        return format(new Date(time), 'yyyy-MM-dd HH:mm:ss');
    }
    return "";
}