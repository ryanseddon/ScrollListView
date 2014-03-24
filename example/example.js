var listContainer = document.querySelector('.scrolllist');
var scrollTimer;
var pageCount = 1;
var ScrollListView;

function render(count) {
    var cellsFrag = document.createDocumentFragment();

    for(var i = 0; i < count; i++) {
        var cell = document.createElement('li'),
        tweet = this.data[i];

        cell.className = 'scrolllist__cell gpuarise';
        cell.innerHTML = tmpl('tweet_tpl', tweet);
        cell.style.order = i+1;
        cellsFrag.appendChild(cell);
    }

    listContainer.appendChild(cellsFrag);
    listContainer.style.minHeight = this.data.length * this.CELLHEIGHT + 'px';
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
            window.removeEventListener('scroll', scrollFn, false);
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
});

function scrollFn() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
        if(scrollListView.cellsOutOfViewportCount >= (scrollListView.data.length - scrollListView.cells.length)) {
            getTweets(++pageCount, function(data) {
                scrollListView.data = scrollListView.data.concat(data);
                listContainer.style.minHeight = scrollListView.data.length * scrollListView.CELLHEIGHT + 'px';
            })
        }
    }, 250);
}

window.addEventListener('scroll', scrollFn, false);

