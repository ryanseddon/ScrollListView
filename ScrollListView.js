//function(window, document){

var winHeight = window.innerHeight,
body = document.body,
slice = [].slice,
CELLHEIGHT = 150,
listContainer = document.createElement('ul'),
listContainerStyle = listContainer.style,
cells,
cellsWithinViewportCount = Math.ceil(winHeight/CELLHEIGHT) * 2,
cellsFrag = document.createDocumentFragment(),
scrollTimer,
rAF,
cellsOutOfViewportCount = cellsWithinViewportCount,
pageCount = 20,
scrollPos = 1,
isScrollingDown,
orderProp = Modernizr.prefixed('order');
scrollTop = lastScrollTop = body.scrollTop,
direction = 0,
cellsState = {},
isTopCellOutOfView = false,
currentCell = null,
ticking = false;

rAF = Modernizr.prefixed('requestAnimationFrame', window) || function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

function isTopElementOutOfViewport(el) {
    var elemPostion = el.getBoundingClientRect();

    return !!elemPostion && elemPostion.bottom <= -(CELLHEIGHT*2);
}

function isBottomElementOutOfViewport(el) {
    var elemPostion = el.getBoundingClientRect();

    return !!elemPostion && elemPostion.top > winHeight + (CELLHEIGHT*2);
}

function onScroll() {
    clearTimeout(timer);
    scrollTop = body.scrollTop;
    direction = scrollTop - lastScrollTop;
    //requestTick();
    checkCells();
    var timer = setTimeout(function(){
        checkCells();
    },200);
}

function requestTick() {
    if(!ticking) {
        rAF(checkCells);
        ticking = true;
    }
}

function getCurrentCell(count) {
    return cells[count % cells.length];
}

function checkCells() {
    cells = cells || slice.call(listContainer.children);
    isScrollingDown = direction > 0;
    currentCell = getCurrentCell(cellsOutOfViewportCount);

    if(isScrollingDown) {
        isTopCellOutOfView = isTopElementOutOfViewport(currentCell);

        if(isTopCellOutOfView) {
            cellsOutOfViewportCount++;
            cellsState.index = cellsOutOfViewportCount;
            listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) + CELLHEIGHT + 'px';
            currentCell.style[orderProp] = cellsState.index;
            currentCell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index-1]);
        }
    } else if(!isScrollingDown) {
        currentCell = getCurrentCell(cellsOutOfViewportCount-1);
        isBottomCellOutOfView = isBottomElementOutOfViewport(currentCell);

        if(isBottomCellOutOfView && cellsOutOfViewportCount > cellsWithinViewportCount) {
            cellsState.index = cells[cellsOutOfViewportCount-- % cells.length].style[orderProp] - 1;
            listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) - CELLHEIGHT + 'px';
            currentCell.style[orderProp] = cellsState.index;
            currentCell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index-1]);
        }

    }

    lastScrollTop = body.scrollTop;
    ticking = false;
}

for(var i = 0; i < cellsWithinViewportCount; i++) {
    var cell = document.createElement('li'),
    tweet = tweets[i];

    cell.className = 'scrolllist__cell  gpuarise';
    cell.innerHTML = tmpl('tweet_tpl', tweet);
    cell.style[orderProp] = i+1;
    cellsFrag.appendChild(cell);
}

listContainer.className = 'scrolllist gpuarise';
listContainerStyle.minHeight = tweets.length * CELLHEIGHT + 'px';
listContainer.appendChild(cellsFrag);
body.appendChild(listContainer);

window.addEventListener('scroll', onScroll, false);

//}(this, this.document);
