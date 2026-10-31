const fs=require('fs');
function logEvent(filename,message){fs.appendFile(filename,`[${new Date().toISOString()}] ${message}\n`,err=>{if(err) console.error('Could not write request log:',err.message);});}
module.exports={logEvent};
