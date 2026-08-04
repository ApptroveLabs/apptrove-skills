const fs=require("fs");


const file=
"app/build.gradle";


if(fs.existsSync(file)){

console.log(
"✅ Gradle file found"
);

}
else{

console.log(
"❌ app/build.gradle missing"
);

}