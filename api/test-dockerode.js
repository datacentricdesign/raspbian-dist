var Docker = require('dockerode');


var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

// docker.pull(, function (err, stream) {
  
// });

docker.pull('grafana/grafana', function(err, stream) {
  //...
  docker.modem.followProgress(stream, onFinished, onProgress);

  function onFinished(err, output) {
    console.log('Done!')
    console.log(output)

    docker.run('grafana/grafana', [], process.stdout, {
      'Volumes': {
        '/stuff': {}
      },
      'ExposedPorts': {
        '80/tcp': {}
      },
      'Env': {
        'TEST_VAR': 'a test variable'
      }
    }, function(err, data, container) {
      if (err){
        return console.error(err);
      }
      console.log(data.StatusCode);
    });
  }
  function onProgress(event) {
    console.log(event)
  }
});





// //run and give a container a name and a label
// docker.run('redis', [], undefined, {
//   "name": 'MyNamedContainer',
//   "Labels": {
//     "environment": "blueWhale"
//   },
//   "HostConfig": {
//     "PortBindings": {
//       "6379/tcp": [
//         {
//           "HostPort": "0"   //Map container to a random unused port.
//         }
//       ]
//     }
//   }
// }, function(err, data, container) {
//   if (err){
//     return console.error(err);
//   }
//   console.log(data.StatusCode);
// });