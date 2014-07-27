var listContainer = document.querySelector('.ScrollListView');
var scrollTimer;
var pageCount = 1;
var ScrollListView;
var lastScrollTop = 0;
var scrollTop = 0;
var scroller;

function render(count) {
    var cellsFrag = document.createDocumentFragment();

    for(var i = 0; i < count; i++) {
        var cell = document.createElement('li'),
        tweet = this.data[i];

        cell.className = 'ScrollListView-cell';
        cell.innerHTML = tmpl('tweet_tpl', tweet);
        cellsFrag.appendChild(cell);
    }

    listContainer.appendChild(cellsFrag);
}

function renderCell(cell, index) {
    cell.innerHTML = tmpl('tweet_tpl', this.data[index]);
}

function getTweets(page, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'page'+ page +'.json', true);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else if(xhr.status === 404) {
            scrollListView.container.removeEventListener('scroll', scrollFn, false);
        }
    }
    xhr.send();
}

getTweets(pageCount, function(data) {
    scrollListView = new ScrollListView({
        element: listContainer,
        data: data,
        cellHeight: 150,
        renderFn: render,
        renderCellFn: renderCell
    });

    scroller = new IScroll(listContainer.parentNode, { probeType: 3, mouseWheel: true, scrollbars: true });

    scroller.on('scroll', function() {
        scrollTop = Math.abs(this.y);
        scrollListView.direction = scrollTop - lastScrollTop;
        scrollListView.checkCells();
    });

    scroller.on('scrollEnd', function() {
        var container = this.wrapper,
            scrollOffset = Math.abs(this.y);

        if(scrollOffset >= Math.abs(this.maxScrollY) - scrollListView.CELLHEIGHT*3) {
            getTweets(++pageCount, function(data) {
                scrollListView.data = scrollListView.data.concat(data);
                listContainer.style.minHeight = scrollListView.data.length * scrollListView.CELLHEIGHT + 'px';
                setTimeout(function () {
                    scroller.refresh();
                }, 0);
            })
        }

        lastScrollTop = scrollOffset;
    });
});

