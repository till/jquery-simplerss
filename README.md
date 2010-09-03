# jquery.simplerss

Inspired by [some recent contract work][blog], this is a really simple plugin to parse an RSS feed with jQuery - my first anyway.

[blog]: http://till.klampaeckel.de/blog/archives/109-Tumblr-Display-a-list-of-entries-in-the-sidebar.html

# Usage

    $('ul.posts').simplerss({url:'/rssfeed'}); // cross-domain is not supported

See `demo.html` in `examples` for a working example.

Available options (and their defaults) are:

    url: '',
    html: '<em><a href="{link}">{title}</a></em><br />{text}',
    wrapper: 'li',
    dataType: 'xml',
    display: 2

That's all.

# License

[New BSD License][bsd]

[bsd]: http://www.opensource.org/licenses/bsd-license.php