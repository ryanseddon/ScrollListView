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
