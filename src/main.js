import { winHeight, body, slice, orderProp, scrollTop, lastScrollTop } from './utils';

function ScrollListView(opts) {
    this.element = opts.element;
    this.elementStyle = opts.element.style;
    this.cells = null;
    this.data = opts.data;
    this.CELLHEIGHT = opts.cellHeight;
    this.cellsWithinViewportCount = Math.ceil(winHeight/this.CELLHEIGHT) * 2;
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
    render: function() {
        if(!this.renderFn) {
            console.error('You need to define a renderFn');
        }
        this.renderFn.call(this, this.cellsWithinViewportCount);
    },

    renderCell: function(cell, index) {
        if(!this.renderCellFn) {
            console.error('You need to define a renderCellFn');
        }
        this.renderCellFn.call(this, cell, index);
    },

    isTopElementOutOfViewport: function isTopElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();

        return !!elemPostion && elemPostion.bottom <= -(this.CELLHEIGHT*2);
    },

    isBottomElementOutOfViewport: function isBottomElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();

        return !!elemPostion && elemPostion.top > winHeight + (this.CELLHEIGHT*2);
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

        if(this.isScrollingDown) {
            this.isTopCellOutOfView = this.isTopElementOutOfViewport(this.currentCell);

            if(this.isTopCellOutOfView && this.cellsOutOfViewportCount < this.data.length) {
                this.cellsOutOfViewportCount++;
                this.cellIndex = this.cellsOutOfViewportCount;
                this.elementStyle.paddingTop = parseInt(this.elementStyle.paddingTop || 0, 10) + this.CELLHEIGHT + 'px';
                this.currentCell.style[orderProp] = this.cellIndex;
                this.renderCell(this.currentCell, this.cellIndex-1);
            }
        } else if(!this.isScrollingDown) {
            this.currentCell = this.getCurrentCell(this.cellsOutOfViewportCount-1);
            this.isBottomCellOutOfView = this.isBottomElementOutOfViewport(this.currentCell);

            if(this.isBottomCellOutOfView && this.cellsOutOfViewportCount > this.cellsWithinViewportCount) {
                this.cellIndex = this.cells[this.cellsOutOfViewportCount-- % this.cells.length].style[orderProp] - 1;
                this.elementStyle.paddingTop = parseInt(this.elementStyle.paddingTop || 0, 10) - this.CELLHEIGHT + 'px';
                this.currentCell.style[orderProp] = this.cellIndex;
                this.renderCell(this.currentCell, this.cellIndex-1);
            }

        }

        lastScrollTop = body.scrollTop;
    }
};

