var fs = require('fs');
var cliTable2Json = require('cli-table-2-json');
var array = [];
var lastarray=[];
var state =0;
var counter=0;
var oldline="";
var regex = /\r/g;
function readLines(input, func) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
      var result = cliTable2Json.cliTable2Json(lastarray);
      console.log(array);
      console.log(lastarray);
      console.log(result);
    }
  });
}
function func(data) {

  array.push(data);
  counter++;
  if(data.indexOf('-')>=0)
  {
    array[counter-2].replace(/[\r\n]/g, "");
    lastarray.push(array[counter-2]);
    //console.log(array[counter-2]);
     state=1;
  }
  else if(state==1 && data.indexOf('#')<=0)
  {
    var res = data.slice(0,1);
    if(res==" ")
    {
      counter-2;
      array[counter-2]=","+array[counter-1].trim();

      var add = array[counter-2].concat(array[counter-1]);

      lastarray.push(add);
    }
    else{
    lastarray.push(array[counter-1]);
        }
      //  console.log(data);
  }
}

var input = fs.createReadStream('show-ip-interface.txt');
readLines(input, func);
