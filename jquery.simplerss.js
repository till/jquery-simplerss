/**
 * Copyright (c) 2010, Till Klampaeckel
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * o Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * o Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 * o Neither the name of the <ORGANIZATION> nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without specific
 *   prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @category RSS
 * @package  simplerss
 * @author   Till Klampaeckel <till@php.net>
 * @license  http://www.opensource.org/licenses/bsd-license.php The New BSD License
 * @link     http://github.com/till/jquery-simplerss
 */
(function($){

    /**
     * @var array o Local variable with the settings.
     */
    var o;

    function isCrossDomain(url) {
        if (url.substring(0, 7) == 'http://') {
            return true;
        }
        if (url.substring(0, 8) == 'https://') {
            return true;
        }
        return false;
    }

    /**
     * My attempt to do cross-domain ajax and pull a feed.
     *
     * @param string url       The URL of the feed.
     * @param obj    container jQuery reference.
     * @return string
     */
    function remoteAjax(url, container) {
        var iframe = jQuery('<iframe>');

        jQuery(iframe).bind('load', function(){
            parseFeed(jQuery(iframe).contents(), container); 
        });

        jQuery(iframe).attr('src', url);
        jQuery(iframe).css('position', 'absolute');
        jQuery(iframe).css('left', '-10000px');
        jQuery(iframe).appendTo('body');
    }

    function parseFeed(feed, container) {

        console.debug(
            'Template: %s, Max: %d, Wrapper: %s',
            o.html, o.display, o.wrapper
        );
        console.debug(container);
        console.debug(feed);

        jQuery(feed).find('item').each(function(i){
            var itemHtml = o.html.replace(/{title}/, jQuery(this).find('title').text());
            itemHtml = itemHtml.replace(/{text}/, jQuery(this).find('description').text());
            itemHtml = itemHtml.replace(/{link}/, jQuery(this).find('guid').text());

            jQuery(container).append(jQuery('<' + o.wrapper + '>').append(itemHtml));

            if (i == o.display) {
                return false;
            }
        });
    }

    jQuery.fn.extend({

        /**
         * simplerss
         *
         * @param array options To override the defaults.
         *
         * @return this
         */
        simplerss: function(options) {  
  
            var defaults = { 
                url: '',
                html: '<em><a href="{link}">{title}</a></em><br />{text}',
                wrapper: 'li',
                dataType: 'xml',
                display: 2
            }

            o = jQuery.extend(defaults, options);

            if (o.url == '') {
                console.error('No url set.');
                return; // avoid this for all elements
            }

            return this.each(function() { 
                var c = jQuery(this);

                if (isCrossDomain(o.url)) {
                    remoteAjax(o.url, c);
                    return;
                }

                jQuery.ajax({
                    url: o.url,
                    type: 'GET',
                    dataType: o.dataType,
                    error: function (xhr, status, e) {
                        console.debug('C: #%s, Error: %s, Feed: %s', $(c).attr('id'), e, o.url);
                    },
                    success: function(feed) {
                        parseFeed(feed, c)
                    }
                });
            });
            return this;
        }
    });
})(jQuery);