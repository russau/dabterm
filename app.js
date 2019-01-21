const Photon = require('electron-photon');
const Terminal = require('xterm').Terminal;
const _debounce = require('lodash.debounce');
const fit = require('xterm/lib/addons/fit/fit');
Terminal.applyAddon(fit);
const pty = require('node-pty-prebuilt');
var Docker = require('dockerode');
var DockerEvents = require('docker-events');

function addTerminal(element, exec) {
  const term = new Terminal({
    fontFamily: 'mono, courier-new, courier, monospace',
    fontSize: 16
  });
  term.open(element, true);
  term.fit();
  term.focus();

  const ptyProc = pty.spawn(exec, [], {
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
}


window.addEventListener("load", function() {

  var pane = $('<div/>').addClass("pane")
          .appendTo('ph-window');
  var newTerm = $('<div/>').addClass("terminal").appendTo(pane);
  addTerminal(newTerm.get(0), '/bin/bash');

  var addTab = function() {
    var tab = $(this).text();
    const myNewTab = document.getElementsByTagName("tab-group")[0].addTab({
      position: "last",
      closeBtn: true,
      isActive: true,
      animated: true,
      content: document.createTextNode(tab) // Node or string
    });
    // hide all terminals and create a new one
    $('.pane').css('display', 'none');
    var pane = $('<div/>').addClass("pane")
            .appendTo('ph-window');
    var newTerm = $('<div/>').addClass("terminal").appendTo(pane);
    addTerminal(newTerm.get(0), '/bin/bash');
  };
  const tabGroup = document.getElementsByTagName("tab-group")[0];
  tabGroup.addEventListener("tabActivate", function(event) {
    var tabPos = $('tab-item').index(event.target);
    $('.pane').each(function( index ) {
      if (tabPos == index) {
        $(this).show();
        // this should give the terminal focus
      } else {
        $(this).hide();
      }
    });
  });
  tabGroup.addEventListener("tabClose", function(event) {
    console.log(event);
  });
  tabGroup.addEventListener("tabMove", function(event) {
    console.log(event);
  });
  tabGroup.addEventListener("tabAdd", function(event) {
    console.log(event);
  });



  var docker = new Docker({
    // shoud this path be passed as a parameter with
    // a default override
    socketPath: '/var/run/docker.sock'
  });

  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      var name = containerInfo.Names[0];
      // <button class="btn btn-default">
      $('<button/>').addClass("btn btn-default")
                    .text(name.replace("/", ""))
                    .appendTo('btn-group')
                    .on("click", addTab);
                    // shouldn't have to do the event here
                    // $('btn-group').on( "click", "button.btn", isn't working!
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
