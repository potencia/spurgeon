'use strict';

function ConsoleLayout () {
    var self = this, stdout;
    self.stdout = ConsoleLayout.create.getStdOut();
    function onResize () {
        self.width = self.stdout.columns;
        self.height = self.stdout.rows;
    }
    onResize();
    self.stdout.on('resize', onResize);
}

ConsoleLayout.create = function create () {
    if (!create.getStdOut().isTTY) {
        return undefined;
    }
    return new ConsoleLayout();
};

ConsoleLayout.create.getStdOut = function () {
    return process.stdout;
};

ConsoleLayout.prototype.outputAll = function (data) {
    this.stdout.write(data[0].label + '. ' + data[0].text + '\n');
};

module.exports = ConsoleLayout;
