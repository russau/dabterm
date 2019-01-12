const Terminal = require('xterm').Terminal;
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

window.onresize = () => {
  // should i debounce this?
  term.fit();
};
