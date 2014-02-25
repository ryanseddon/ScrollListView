//(function(window, document){

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
        cellsOutOfViewportCount = 0,
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

        return !!elemPostion && elemPostion.bottom <= -CELLHEIGHT; //(CELLHEIGHT*2);
    }

    function isBottomElementOutOfViewport(el) {
        var elemPostion = el.getBoundingClientRect();

        return !!elemPostion && elemPostion.top > winHeight + CELLHEIGHT; //(CELLHEIGHT*2);
    }

    function onScroll() {
        scrollTop = body.scrollTop;
        direction = scrollTop - lastScrollTop;
        requestTick();
    }

    function requestTick() {
        if(!ticking) {
            rAF(checkCells);
            ticking = true;
        }
    }

    function getCurrentCell() {
        return cells[cellsOutOfViewportCount % cells.length];
    }

    function getCurrentBottomCell() {
        var index = cellsOutOfViewportCount-1 % cells.length;

        if(index < 0 ) {

        }
        return cells[index];
    }

    function checkCells() {
        cells = cells || slice.call(listContainer.children);
        isScrollingDown = direction > 0;
        currentCell = getCurrentCell();
        

        if(isScrollingDown) {
            isTopCellOutOfView = isTopElementOutOfViewport(currentCell);

            if(isTopCellOutOfView) {
                cellsOutOfViewportCount++;
                cellsState.index = cells.length + cellsOutOfViewportCount;
                listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) + CELLHEIGHT + 'px';
                currentCell.style[orderProp] = cellsState.index;
                currentCell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index]);
            }
        } else {
            currentCell = getCurrentBottomCell();
            console.log('order: ', currentCell.style[orderProp]);
            isBottomCellOutOfView = isBottomElementOutOfViewport(currentCell);

            if(isBottomCellOutOfView) {
                cellsOutOfViewportCount--;
                cellsState.index = cells.length + cellsOutOfViewportCount;
                listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) - CELLHEIGHT + 'px';
                currentCell.style[orderProp] = cellsState.index;
                currentCell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index]);
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
        cellsFrag.appendChild(cell);
    }

    listContainer.className = 'scrolllist gpuarise';
    listContainerStyle.minHeight = tweets.length * CELLHEIGHT + 'px';
    listContainer.appendChild(cellsFrag);
    body.appendChild(listContainer);

    window.addEventListener('scroll', onScroll, false);

//}(this, this.document));
