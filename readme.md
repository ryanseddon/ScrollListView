# ScrollListView

ScrollListView.js is a library that allows you to scroll over large data sets without get a performance impact.
It does this though a clever algorithm of re-using a fixed number of cells and as you scroll repaints them beneath the last item.
Think iOS UITableView for the web.

## Context

Take a look at the [article](http://www.thecssninja.com/javascript/scrolllistview) I wrote about it if you'd like to know more about how it works.

## Installation

```js
npm install ScrollListView
```

Include the script in your website it can be placed anywhere or combined with other scripts.

### Usage

This is a UMD package so if you just include the script in your page it'll attach to the window.

But if you prefer a module system this will work fine with commonjs or AMD modules just fine.

```js
var ScrollListView = require('ScrollListView');

var scrollListView = new ScrollListView({
  element: document.querySelector('.list'),
  data: [... array of objects to render],
  cellHeight: 150,
  renderFn: render,
  renderCellFn: renderCellFn
});
```

#### API

<table>
    <tr>
        <th>element</th>
        <td>The element that the re-usable cells will live inside. You don't add children to this the `renderFn` takes care of that.</td>
    </tr>
    <tr>
        <th>data</th>
        <td>The array of data the list will read from work scroll offset and heights</td>
    </tr>
    <tr>
        <th>cellHeight</th>
        <td>The abslute height in px that the cell will be.</td>
    </tr>
    <tr>
        <th>renderFn</th>
        <td>This function gets called on initialisation to render the initial list.</td>
    </tr>
    <tr>
        <th>renderCellFn</th>
        <td>When a cell is determined to be far enough out of the viewport this will be called with the element you can safely overwrite with the new data and the index in your data array passed in earlier. </td>
    </tr>
</table>

#### render methods

The only thing that ScrollListView expects is that you pass through an array that contains your list data. How you choose to render that data is up to you.

I'll take the example code and walk you through how I chose to render my ScrollListView.

```js
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
```

The above is very simple the `count` argument is the length of cells that the list uses based on some calculations on window height and the `cellHeight` you would of configured on init.

All I'm doing is creating a document fragment and looping over the `count` grabbing the corresponding bits of data from the data passed into our constructor it then create a list item that I innerHTML my data using the very simple tpl.js template engine.

#### renderCell method

The `renderCell` method is even easier.

```js
function renderCell(cell, index) {
  cell.innerHTML = tmpl('tweet_tpl', this.data[index]);
}
```

This method passes in the `cell` and the `index` of which bit of data I should render into this cell then all I do is apply the template to the `cell`.

Each of these methods our bound to the instance they're called from so `this` refers to your scrollListView instance.

## License

Copyright 2014, Ryan Seddon
This content is released under the MIT license http://ryanseddon.mit-license.org
