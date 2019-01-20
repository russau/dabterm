const Photon = require('electron-photon');


window.addEventListener("load", function() {

  const Terminal = require('xterm').Terminal;
  const _debounce = require('lodash.debounce');
  const fit = require('xterm/lib/addons/fit/fit');
  Terminal.applyAddon(fit);

  const pty = require('node-pty-prebuilt');

  const term = new Terminal({
    fontFamily: 'mono, courier-new, courier, monospace',
    fontSize: 16
  });

  term.open(document.getElementById('term'), true);
  term.fit();
  term.focus();

  const ptyProc = pty.spawn('/bin/bash', [], {
      cols: term.cols,
      rows: term.rows
  });

  term.on('data', function(data) {
      ptyProc.write(data);
  });

  ptyProc.on('data', function(data) {
      term.write(data);
  });

  term.on('resize', function(size) {
      ptyProc.resize(
          Math.max(size ? size.cols : term.cols, 1),
          Math.max(size ? size.rows : term.rows, 1)
      );
  });

  fitDebounced = _debounce(() => {
      term.fit();
  }, 17);

  window.onresize = () => {
      fitDebounced();
  };

  $('.btn').on('click', function() {
    const myNewTab = document.getElementsByTagName("tab-group")[0].addTab({
      position: "last", // "last" or "first"
      closeBtn: true, // Wether the tab can be closed using a button within it
      isActive: true, // Wether the tab item will be the active one
      animated: true, // Wether an animation will be shown when adding the tab item
      content: document.createTextNode($(this).text()) // Node or string
    });
  });

  var Docker = require('dockerode');
  var DockerEvents = require('docker-events');
  var stream = require('stream');

  var docker = new Docker({
    socketPath: '/var/run/docker.sock'
  });

  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      var name = containerInfo.Names[0];
      $('<button/>').addClass("btn btn-default").text(name).appendTo('btn-group');
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

});
