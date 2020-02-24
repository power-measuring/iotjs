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

var fs = require('fs')

// Download a file that is specified in the url argument.
function download(url, output_filename, cnt) {
  // Basic URL parser.
  var match = /(https?):\/\/([.\w]+)(?::(\d+))?\/([\/\w.-]+)?/.exec(url)

  console.log('start downloading image: ', cnt);

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
    var fd = fs.openSync(output_filename, "w");

    response.on('data', function(chunk) {
      fs.write(fd, chunk, 0, chunk.length, function(){});
    });

    response.on('end', function() {
      fs.closeSync(fd);
      console.log(output_filename + ' is saved successfully.');

      if (cnt < 100){
	download('http://127.0.0.1:8822/logo.png', "logo.png", cnt + 1);
      } else {
	return ;
      }
    });
  }).on('error', function() {
    console.log(arguments);
    console.log(arguments[0]);
  });
}

for (var i = 0; i < 5; i++) {
	download('http://127.0.0.1:8822/logo.png', "logo.png", 0);
}
