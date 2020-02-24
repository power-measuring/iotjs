/* Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function sortby_pos1(a, b){
  var suma = a.positions[1].x + a.positions[1].y + a.positions[1].z;
  var sumb = b.positions[1].x + b.positions[1].y + b.positions[1].z;

  return suma - sumb;
}

// Download jsons whose number is specified in the url argument.
function download(url, sortby) {
  // Basic URL parser.
  var match = /(https?):\/\/([.\w]+)(?::(\d+))?\/([\/\w.-]+)?/.exec(url)

  console.log('start downloading jsons');

  if (match == null) {
    console.log('Please specify the protocol in the address: http(s)://...');
    return false;
  }

  protocol = match[1];
  host = match[2];

  if (protocol === 'https') {
    var srv = require('https');
    var port = 443;
  } else {
    var srv = require('http');
    var port = 80;
  }

  var options = {
    method: 'GET',
    host: host,
    port: parseInt(match[3]) || port,
    path: '/' + match[4],
    rejectUnauthorized: false
  };

  srv.get(options, function(response) {
    var array = new Array();
    var complete = "";
    response.on('data', function(chunk) {
      complete += chunk;
      if (complete.indexOf('\n') >= 0){
        try{
          var data_arr = complete.split('\n');
          //判断最后一个json是否完整，不完整则保留最后一段str
          if(complete[complete.length - 1] != '\n'){
            complete = data_arr[data_arr.length - 1];

            for(var k = 0; k < data_arr.length - 1; k++){
              if(data_arr[k].length > 1){
                var data = JSON.parse(data_arr[k]);
                array.push(data);
              }
            }

          } else {
            complete = "";
            for(var k = 0; k < data_arr.length; k++){
              if(data_arr[k].length > 1){
                var data = JSON.parse(data_arr[k]);
                array.push(data);
              }
            }
          }
          
        }catch(e){
          console.log(e);
        }
      }

    });

    response.on('end', function() {
      console.log('jsons are downloaded successfully.');

      array.sort(sortby);

      console.log('sorted successfully');

    });
  }).on('error', function() {
    console.log(arguments);
    console.log(arguments[0]);
  });
}

//for (var i = 0; i < 5; i++) {
//	download('http://127.0.0.1:8822/logo.png', "logo.png", 0);
//}

download('http://127.0.0.1:2222/500', sortby_pos1);

