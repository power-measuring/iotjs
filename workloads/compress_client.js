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

var LZString = require("./LZString.js");

// Download jsons whose number is specified in the url argument.
function download(url) {
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
    var aftercpr = ""; //压缩后字符串
    var complete = ""; //接收数据缓冲区
    response.on('data', function(chunk) {
      complete += chunk.toString();
      if(complete.indexOf('\n') >= 0){
        var data_arr = complete.split('\n');
        //判断最后一个json是否完整，不完整则保留最后一段str
        if(complete[complete.length - 1] != '\n'){
          complete = data_arr[data_arr.length - 1];
          for(var k = 0; k < data_arr.length - 1; k++){
            if(data_arr[k].length > 1){
              var json_obj = JSON.parse(data_arr[k]);
              aftercpr += LZString.compressToEncodedURIComponent(data_arr[k].replace(/\"/g,"'"));
            }
          }
        } else {
          complete = "";
          for(var k = 0; k < data_arr.length - 1; k++){
            if(data_arr[k].length > 1){
              var json_obj = JSON.parse(data_arr[k]);
              aftercpr += LZString.compressToEncodedURIComponent(data_arr[k].replace(/\"/g,"'"));
            }
          }
        }
      }
    });

    response.on('end', function() {
      console.log('jsons are downloaded successfully. Compress done');
    });
  }).on('error', function() {
    console.log(arguments);
    console.log(arguments[0]);
  });
}

//for (var i = 0; i < 5; i++) {
//	download('http://127.0.0.1:8822/logo.png', "logo.png", 0);
//}

download('http://127.0.0.1:2222/500');

