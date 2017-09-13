#!/usr/bin/env node
const zlib=require('zlib');
const fs=require('fs');
const path=require('path');
const resolveParams=require('./resolveParams');
const params=process.argv.slice(2);
const nowPath=process.cwd();
const opts=resolveParams(params);
const inputFolder=params[0];
Array.prototype.asyncForEach=function(fn,end){
    return this.length?fn(this[0],()=>this.slice(1).asyncForEach(fn,end)):end();
}

const createFs=(filePath,outPath,cb)=>{
    ws=fs.createWriteStream(outPath);
    rs=fs.createReadStream(filePath);
    gzip=zlib.createGzip();
    ws.on('close',cb);
    rs.pipe(gzip).pipe(ws);
}
const readF=(inputPath,outPath,cb)=>{
    fs.stat(inputPath,(err,result)=>{
        if(result.isDirectory()){
            fs.readdir(inputPath,(err,list)=>{
                fs.mkdir(outPath,(err)=>{
                    list.asyncForEach(
                        (val,next)=>readF(path.join(inputPath,val),path.join(outPath,val),next),cb
                    )
                })
            })
        }else{
            createFs(inputPath,outPath,cb);
        }
    })
}


if(inputFolder&&!inputFolder.match(/^--/)){
    const outFolder=opts.out||inputFolder+'.gz';
     readF(inputFolder,outFolder,()=>{
         console.log('\x1b[33m','compress complete')
         console.log('','All files are compressed in','\x1b[31m',outFolder)
     })
}else{
    console.error('Must specify input folder!')
}



