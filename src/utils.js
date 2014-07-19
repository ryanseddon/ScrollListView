var winHeight = window.innerHeight,
    body = document.body,
    slice = [].slice,
    orderProp = 'webkitOrder' in body.style ? 'webkitOrder' : 'order',
    scrollTop = body.scrollTop,
    lastScrollTop = body.scrollTop,
    resizeTimer;

export { winHeight, body, slice, orderProp, scrollTop, lastScrollTop, resizeTimer };

