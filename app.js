const Terminal = require('xterm').Terminal;
const pty = require('node-pty-prebuilt');

const term = new Terminal({
  fontFamily: 'mono, courier-new, courier, monospace',
  fontSize: 16,
  experimentalCharAtlas: 'dynamic'
});

term.open(document.getElementById('terminal'));

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
