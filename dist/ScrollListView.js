!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ScrollListView=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var winHeight = _dereq_('./utils').winHeight;
var body = _dereq_('./utils').body;
var slice = _dereq_('./utils').slice;
var orderProp = _dereq_('./utils').orderProp;
var scrollTop = _dereq_('./utils').scrollTop;
var lastScrollTop = _dereq_('./utils').lastScrollTop;
function ScrollListView(opts) {
    this.element = opts.element;
    this.elementStyle = opts.element.style;
    this.cells = null;
    this.data = opts.data;
    this.childElement = 'li';
    this.CELLHEIGHT = opts.cellHeight;
    this.cellsWithinViewportCount = Math.ceil(winHeight / this.CELLHEIGHT) * 2;
    this.cellsOutOfViewportCount = this.cellsWithinViewportCount;
    this.cellsFrag = document.createDocumentFragment();
    this.direction = 0;
    this.isScrollingDown = true;
    this.currentCell = null;
    this.cellIndex = 1;
    this.isTopCellOutOfView = false;
    this.renderFn = opts.renderFn;
    this.renderCellFn = opts.renderCellFn;
    this.render();
    window.addEventListener('scroll', this.onScroll.bind(this), false);
}
module.exports = ScrollListView;
ScrollListView.prototype = {
    render: function () {
        if (!this.renderFn) {
            console.error('You need to define a renderFn');
        }
        this.renderFn.call(this, this.cellsWithinViewportCount);
    },
    renderCell: function (cell, index) {
        if (!this.renderCellFn) {
            console.error('You need to define a renderCellFn');
        }
        this.renderCellFn.call(this, cell, index);
    },
    isTopElementOutOfViewport: function isTopElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();
        return !!elemPostion && elemPostion.bottom <= -(this.CELLHEIGHT * 2);
    },
    isBottomElementOutOfViewport: function isBottomElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();
        return !!elemPostion && elemPostion.top > winHeight + this.CELLHEIGHT * 2;
    },
    onScroll: function onScroll() {
        scrollTop = body.scrollTop;
        this.direction = scrollTop - lastScrollTop;
        this.checkCells();
    },
    getCurrentCell: function getCurrentCell(count) {
        return this.cells[count % this.cells.length];
    },
    checkCells: function checkCells() {
        this.cells = this.cells || slice.call(this.element.children);
        this.isScrollingDown = this.direction > 0;
        this.currentCell = this.getCurrentCell(this.cellsOutOfViewportCount);
        if (this.isScrollingDown) {
            this.isTopCellOutOfView = this.isTopElementOutOfViewport(this.currentCell);
            if (this.isTopCellOutOfView && this.cellsOutOfViewportCount < this.data.length) {
                this.cellsOutOfViewportCount++;
                this.cellIndex = this.cellsOutOfViewportCount;
                this.elementStyle.paddingTop = parseInt(this.elementStyle.paddingTop || 0, 10) + this.CELLHEIGHT + 'px';
                this.currentCell.style[orderProp] = this.cellIndex;
                this.renderCell(this.currentCell, this.cellIndex - 1);
            }
        } else if (!this.isScrollingDown) {
            this.currentCell = this.getCurrentCell(this.cellsOutOfViewportCount - 1);
            this.isBottomCellOutOfView = this.isBottomElementOutOfViewport(this.currentCell);
            if (this.isBottomCellOutOfView && this.cellsOutOfViewportCount > this.cellsWithinViewportCount) {
                this.cellIndex = this.cells[this.cellsOutOfViewportCount-- % this.cells.length].style[orderProp] - 1;
                this.elementStyle.paddingTop = parseInt(this.elementStyle.paddingTop || 0, 10) - this.CELLHEIGHT + 'px';
                this.currentCell.style[orderProp] = this.cellIndex;
                this.renderCell(this.currentCell, this.cellIndex - 1);
            }
        }
        lastScrollTop = body.scrollTop;
    }
};
},{"./utils":2}],2:[function(_dereq_,module,exports){
var winHeight = window.innerHeight,
    body = document.body,
    slice = [].slice,
    orderProp = 'webkitOrder' in body.style ? 'webkitOrder' : 'order',
    scrollTop = body.scrollTop,
    lastScrollTop = body.scrollTop;

exports.winHeight = winHeight;
exports.body = body;
exports.slice = slice;
exports.orderProp = orderProp;
exports.scrollTop = scrollTop;
exports.lastScrollTop = lastScrollTop;

},{}]},{},[1])
(1)
});