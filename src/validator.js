function validateRegistration(input = {}) {
 const data={name:String(input.name??'').trim(),email:String(input.email??'').trim().toLowerCase(),prn:String(input.prn??'').trim(),mobile:String(input.mobile??'').replace(/\s+/g,''),course:String(input.course??'').trim()};
 const errors=[];
 if(data.name.length<2) errors.push('Name must contain at least 2 characters.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Enter a valid email address.');
 if(!/^\d{12}$/.test(data.prn)) errors.push('PRN must contain exactly 12 digits.');
 if(!/^[6-9]\d{9}$/.test(data.mobile)) errors.push('Mobile number must be 10 digits and start with 6, 7, 8, or 9.');
 if(!['B.Tech','M.Tech','BCA','MCA'].includes(data.course)) errors.push('Choose a valid course from the available list.');
 return {valid:errors.length===0,errors,data};
}
module.exports={validateRegistration};
