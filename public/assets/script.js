$(document).ready(function() {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (h > 384) {
        $('.header').animate({
            'height': h
        }, 100);
    }
    if ($('.alert').hasClass('in')) {
        setTimeout(function() {
            $('.alert').fadeOut().removeClass('in');
        }, 2000);
    }
    $('.js-btn-cta').click(function() {
        $(this).animate({
            opacity: 0
        }).hide().next().show().animate({
            opacity: 1
        });
    });
    animateHeadline($('.js-phrase-rotate'));
    setTimeout(function() {
        $('.hero-copy').addClass('slideIn');
    }, 200);
    setTimeout(function() {
        $('.iphone-promo-container').addClass('slideIn');
    }, 500);
    $.fn.nextOrFirst = function(selector) {
        var next = this.next(selector);
        return (next.length) ? next : this.prevAll(selector).last();
    };

    function animateHeadline($phrases) {
        this.reps = 0;
        $phrases.each(function() {
            var phrase = $(this);
            var phraseFlip = setInterval(function() {
                var $oldPhrase = phrase.find('.is-visible').eq(0);
                var $newPhrase = $oldPhrase.nextOrFirst();
                switchPhrase($oldPhrase, $newPhrase);
                if (reps == 2) clearInterval(phraseFlip);
                reps++;
            }, 2200);
        });
    }

    function switchPhrase($oldPhrase, $newPhrase) {
        $oldPhrase.removeClass('is-visible').addClass('is-hidden');
        $newPhrase.removeClass('is-hidden').addClass('is-visible');
    }
});


$('.play-button').nivoLightbox({
    afterShowLightbox: function() {
        src = $('.nivo-lightbox-content > iframe').attr('src');
        $('.nivo-lightbox-content > iframe').attr('src', src + '?autoplay=1');
        $('.nivo-lightbox-content').css({
            'height': '95%',
            'width': '79%',
            'margin': '0 auto'
        });
    },
    beforeHideLightbox: function() {
        $('.nivo-lightbox-content > iframe').remove();
    }
});
$('.play-button').fitVids();
var App = {
    init: function() {
        App.Lightbox();
    },
    Lightbox: function() {
        $('a.falselink').nivoLightbox({
            effect: 'fall',
        });
    },
};
$(function() {
    App.init();
});