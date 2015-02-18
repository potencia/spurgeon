'use strict';

function Layout () {
    this.indent = 4;
    this.columns = process.stdout.columns;
}

Layout.prototype.layoutPoint = function (point, indent) {
    var bullet = '-', indents = [[]], i, c, current, result = [], temp = point.text.split('');
    function addToIndent () {
        this.unshift(' ');
    }
    function finalize (current) {
        var indent = indents.shift();
        Array.prototype.unshift.apply(current, indent);
        if (!indents.length) {
            indents.unshift(indent);
        }
        result.push(current);
    }
    if (!!point.label) {
        if (point.label !== true) {
            bullet = '' + point.label;
        }
        Array.apply(null, {length : this.indent}).forEach(addToIndent, indents[0]);
        indents.unshift([]);
        if (bullet.length < this.indent) {
            Array.apply(null, {length : this.indent - bullet.length}).forEach(addToIndent, indents[0]);
            Array.prototype.unshift.apply(indents[0], bullet.split(''));
        } else {
            indents[0] = bullet.split('');
            indents[0].push(' ');
        }
    }
    while (temp.length > 1) {
        while (temp.length && (c = temp.shift()) === ' ');
        temp.unshift(c);
        current = temp.splice(0, this.columns - indents[0].length);
        if ((c = temp.shift()) === ' ') {
            finalize(current);
        } else {
            if (c !== undefined) {
                temp.unshift(c);
            }
            while (temp.length && (c = current.pop()) !== ' ') {
                temp.unshift(c);
            }
            if (current.length === 0) {
                current = temp.splice(0, this.columns);
            }
            finalize(current);
        }
    }
    return result.map(function (d) {
        return d.join('');
    });
}

module.exports = Layout;
