const lib=['out'];

module.exports=function(params){
    const result={};
    let reg,index=0,nowVal,end=params.length-1;
    const each=(index)=>{
        if(index>=end)return;
        nowVal=params[index++];
        for(let i of lib){
            reg=new RegExp('^--'+i+'$');
            if(nowVal.match(reg)){
                result[i]=params[index++];
                break;
            }
        }
        each(index);
    }
    each(index);
    return result;
}