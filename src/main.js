import { winHeight, body, slice, orderProp, scrollTop, lastScrollTop, resizeTimer } from './utils';
require('./styles.css');

function ScrollListView(opts) {
    var container = opts.element.parentNode || body,
        containerHeight = container.offsetHeight || body.offsetHeight;

    this.element = opts.element;
    this.elementStyle = opts.element.style;
    this.container = container;
    this.containerHeight = containerHeight;
    this.cells = null;
    this.data = opts.data;
    this.CELLHEIGHT = opts.cellHeight;
    this.cellsWithinViewportCount = Math.ceil(this.containerHeight/this.CELLHEIGHT) * 2;
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
    this.container.addEventListener('scroll', () => this.onScroll(), false);
    window.addEventListener('resize', () => this.onResize(), false);
}

ScrollListView.prototype = {
    render() {
        var index, css,
            height = this.CELLHEIGHT;

        if(!this.renderFn) {
            console.error('You need to define a renderFn');
        }

        this.renderFn.call(this, this.cellsWithinViewportCount);
        slice.call(this.element.children).forEach(function(cell, i) {
            index = i+1;
            css = [
                'height:', height, 'px;',
                'order:', index, ';',
                '-webkit-order:', index, ';'
            ].join('');

            cell.style.cssText = css;
        });

        this.element.style.minHeight = this.cellsWithinViewportCount * this.CELLHEIGHT + 'px';
    },

    renderCell(cell, index) {
        if(!this.renderCellFn) {
            console.error('You need to define a renderCellFn');
        }
        this.renderCellFn.call(this, cell, index);
    },

    isTopElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();

        return !!elemPostion && elemPostion.bottom <= -(this.CELLHEIGHT*2);
    },

    isBottomElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();

        return !!elemPostion && elemPostion.top > this.containerHeight + (this.CELLHEIGHT*2);
    },

    onScroll() {
        scrollTop = this.container.scrollTop;
        this.direction = scrollTop - lastScrollTop;
        this.checkCells();
    },

    onResize(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            this.containerHeight = this.container.offsetHeight;
        }.bind(this), 250);
    },

    getCurrentCell(count) {
        return this.cells[count % this.cells.length];
    },

    checkCells() {
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

        lastScrollTop = this.container.scrollTop;
    }
};

module.exports = ScrollListView;

