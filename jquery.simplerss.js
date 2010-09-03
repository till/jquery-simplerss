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
            var options =  jQuery.extend(defaults, options);
  
            return this.each(function() { 
                var o = options;
                var c = $(this);

                jQuery.ajax({
                    url: o.url,
                    type: 'GET',
                    dataType: o.dataType,
                    error: function (xhr, status, e) {
                        console.debug(xhr);
                        console.debug(status);
                        console.debug(e);
                    },
                    success: function(feed){

                        var html  = '';
                        var item  = null;

                        jQuery(feed).find('item').each(function(i){

                            item = jQuery(this);

                            var itemHtml = o.html.replace(/{title}/, jQuery(item).find('title').text());
                            itemHtml = itemHtml.replace(/{text}/, jQuery(item).find('description').text());
                            itemHtml = itemHtml.replace(/{link}/, jQuery(item).find('guid').text());

                            html += itemHtml;

                            if (i == o.display) {
                                break
                            }

                        });

                        jQuery(c).append(html);
                    }
                });
            }
        }
    });
})(jQuery);