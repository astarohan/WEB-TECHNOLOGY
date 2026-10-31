const http=require('http'),fs=require('fs'),path=require('path');
const {EventEmitter}=require('events'); const {Transform}=require('stream');
const {validateRegistration}=require('./src/validator'); const {logEvent}=require('./src/logger');
const PORT=Number(process.env.PORT||3000), PUBLIC_DIR=path.join(__dirname,'public'), logPath=path.join(__dirname,'requests.log');
const events=new EventEmitter();
events.on('registration:valid',d=>logEvent(logPath,`VALID registration: ${d.name} | ${d.email}`));
events.on('registration:invalid',e=>logEvent(logPath,`INVALID registration: ${e.join('; ')}`));
function sendJson(res,status,payload){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(payload,null,2));}
function readBody(req){return new Promise((resolve,reject)=>{let body='';req.setEncoding('utf8');req.on('data',chunk=>{body+=chunk;if(body.length>1000000){reject(new Error('Request body too large'));req.destroy();}});req.on('end',()=>resolve(body));req.on('error',reject);});}
function normalizeStream(input){return new Promise((resolve,reject)=>{let out='';const tr=new Transform({transform(chunk,enc,cb){cb(null,chunk.toString().trim());}});tr.on('data',c=>out+=c.toString());tr.on('end',()=>resolve(out));tr.on('error',reject);tr.end(input);});}
function staticFile(res,name,type){fs.readFile(path.join(PUBLIC_DIR,name),(err,data)=>{if(err){res.writeHead(500);return res.end('Unable to load application page.');}res.writeHead(200,{'Content-Type':type});res.end(data);});}
http.createServer(async(req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
 if(req.method==='GET'&&(url.pathname==='/'||url.pathname==='/index.html'))return staticFile(res,'index.html','text/html; charset=utf-8');
 if(req.method==='GET'&&url.pathname==='/styles.css')return staticFile(res,'styles.css','text/css; charset=utf-8');
 if(req.method==='GET'&&url.pathname==='/app.js')return staticFile(res,'app.js','text/javascript; charset=utf-8');
 if(req.method==='GET'&&url.pathname==='/health')return sendJson(res,200,{status:'ok',service:'Student Registration Server',port:PORT});
 if(req.method==='GET'&&url.pathname==='/api/info')return sendJson(res,200,{name:'Student Registration Server',endpoints:['GET /health','GET /api/info','POST /api/register'],capabilities:['HTTP GET/POST','server-side validation','custom modules','file system','events','transform stream']});
 if(req.method==='POST'&&url.pathname==='/api/register'){
  try{const raw=await readBody(req);const normalized=await normalizeStream(raw);let data;try{data=JSON.parse(normalized||'{}');}catch{return sendJson(res,400,{success:false,message:'Request body must be valid JSON.'});}
   const result=validateRegistration(data);if(!result.valid){events.emit('registration:invalid',result.errors);return sendJson(res,422,{success:false,message:'Validation failed. Correct the fields and try again.',errors:result.errors});}
   const student={name:result.data.name,email:result.data.email,prn:result.data.prn,mobile:result.data.mobile,course:result.data.course};events.emit('registration:valid',student);
   return sendJson(res,201,{success:true,message:'Registration details validated successfully.',student});
  }catch(e){return sendJson(res,e.message==='Request body too large'?413:500,{success:false,message:e.message==='Request body too large'?e.message:'Internal server error.'});}
 }
 return sendJson(res,404,{success:false,message:'Route not found.'});
}).listen(PORT,'0.0.0.0',()=>console.log(`Student Registration Server running at http://localhost:${PORT}\\nGET /health | GET /api/info | POST /api/register`));