(function(window, document){

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
        cellsState = {},
        ticking = false;

    rAF = Modernizr.prefixed('requestAnimationFrame', window) || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    function isElementInViewport (el) {
        var elemPostion = el.getBoundingClientRect(),
            html = document.documentElement;

        return !!elemPostion && elemPostion.bottom >= -(CELLHEIGHT*2);
    }

    function isElementOutViewport (el) {
        var elemPostion = el.getBoundingClientRect(),
            html = document.documentElement;

        return !!elemPostion && elemPostion.top >= (winHeight + CELLHEIGHT*2);
    }

    function onScroll() {
        scrollTop = body.scrollTop;
        requestTick();
    }

    function requestTick() {
        if(!ticking) {
            rAF(checkCells);
            ticking = true;
        }
    }

    function checkCells() {
        cells = cells || slice.call(listContainer.children);
        isScrollingDown = (scrollTop > lastScrollTop) ? true : false;

        cells.forEach(function(cell, i) {
            cellsState.style = cell.style;

            if(!isElementInViewport(cell) && isScrollingDown) {
                cellsOutOfViewportCount++;
                cellsState.index = cells.length + cellsOutOfViewportCount;
                listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) + CELLHEIGHT + 'px';
                cellsState.style[orderProp] = cellsState.index;
                cell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index]);
            } else if(!isScrollingDown
                    && isElementOutViewport(cell)
                    && scrollTop > CELLHEIGHT
                    && cellsState.style[orderProp] == cellsState.index) {
                if(cellsState.index <= cells.length * 2) {
                    cellsState.style[orderProp] = '';
                } else {
                    cellsState.style[orderProp] = cellsState.index-cells.length;
                }
                cellsOutOfViewportCount--;
                cellsState.index--;
                listContainerStyle.paddingTop = parseInt(listContainerStyle.paddingTop || 0, 10) - CELLHEIGHT + 'px';
                cell.innerHTML = tmpl('tweet_tpl', tweets[cellsState.index-cells.length]);
                console.log('index: ', cellsState.index-cells.length);
            }
        });

        lastScrollTop = body.scrollTop;
        ticking = false;
    }

    for(var i = 0; i < cellsWithinViewportCount; i++) {
        var cell = document.createElement('li');
        cell.className = 'scrolllist__cell  gpuarise';
        cell.innerHTML = tmpl('tweet_tpl', tweets[i]);
        cellsFrag.appendChild(cell);
    }

    listContainer.className = 'scrolllist gpuarise';
    listContainerStyle.minHeight = tweets.length * CELLHEIGHT + 'px';
    listContainer.appendChild(cellsFrag);
    body.appendChild(listContainer);

    window.addEventListener('scroll', onScroll, false);

}(this, this.document));
