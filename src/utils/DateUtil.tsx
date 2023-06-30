import format from 'date-fns/format';

export function DateFormat( time : number | undefined ) : string {
    if ( time ){
        return format(new Date(time), 'yyyy-MM-dd HH:mm:ss');
    }
    return "";
}

export function DateFormatBeforeNow( time : number | undefined ) : {
    day : number,
    hour : number,
    minute : number,
    second : number
} | undefined {
    if ( time ){
        const nowTime = new Date().getTime();
        time = time * 1000;
        const timeInterval = Math.floor ( (nowTime - time) / 1000 );
        let day = Math.floor ( timeInterval / (60 * 60 * 24) );                     // 计算天数
        let hour = Math.floor( timeInterval % (60 * 60 * 24) / (60 * 60) );         // 计算小时
        let minute = Math.floor ( timeInterval % (60 * 60 * 24) % (60 * 60) / 60 ); // 计算分钟
        let second = Math.floor(
            timeInterval % (60 * 60 * 24) % (60 * 60) % 60                          // 计算秒
        );
        return {
            day,hour,minute,second
        }; 
    }
    return undefined;
}
