
var Docker = require('dockerode');
var DockerEvents = require('docker-events');
var stream = require('stream');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

docker.listContainers(function (err, containers) {
  containers.forEach(function (containerInfo) {
    console.log(containerInfo.Names[0]);
  });
});

var emitter = new DockerEvents({
  docker: docker,
});

emitter.start();

var dockerEvent = function (message) {
  console.log(`${message.status} ${message.Actor.Attributes.name}`);
};

emitter.on("start", dockerEvent)
       .on("stop", dockerEvent)
       .on("die", dockerEvent)
       .on("destroy", dockerEvent);
