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

  term.open(document.getElementById('term'));
  term.fit();

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

});
