(function($){
    jQuery.fn.extend({
        simplerss: function(options) {  
  
            var defaults = { 
                url: '',
                html: '<em><a href="{link}">{title}</a></em><br />{text}',
                wrapper: 'li',
                dataType: 'xml',
                display: 2
            }
            var options = jQuery.extend(defaults, options);
  
            return this.each(function() { 
                var o = options;
                var c = jQuery(this);

                jQuery.ajax({
                    url: o.url,
                    type: 'GET',
                    dataType: o.dataType,
                    error: function (xhr, status, e) {
                        console.debug('C: #%s, Error: %s, Feed: %s', $(c).attr('id'), e, o.url);
                    },
                    success: function(feed){

                        jQuery(feed).find('item').each(function(i){

                            var itemHtml = o.html.replace(/{title}/, jQuery(this).find('title').text());
                            itemHtml = itemHtml.replace(/{text}/, jQuery(this).find('description').text());
                            itemHtml = itemHtml.replace(/{link}/, jQuery(this).find('guid').text());

                            jQuery(c).append(jQuery('<' + o.wrapper + '>').append(itemHtml));

                            if (i == o.display) {
                                return;
                            }

                        });
                    }
                });
            });
        }
    });
})(jQuery);