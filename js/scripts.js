$(function() {
    var isMobile = is_touch_device() || $(window).width() <= 1024;

    $(window).load(function(){
        if(isMobile){
            $('.body').addClass('mobile');
        } else {
            initSlides();
        }

        offersInit();
    });

    $('input[type="text"]').on('blur', inputPlaceholder);
    $('#request, #subscribe').on('submit', formSubmit);
});

function is_touch_device() {
  return !!('ontouchstart' in window);
}

function inputPlaceholder()
{
    var self = $(this);

    if($(this).val()){
        self.addClass('not-empty');
    } else {
        self.removeClass('not-empty');
    }
}

function offersInit()
{
    $('.offer').each(function(){
        var obj = $(this);
        var items = obj.find('.offer_item');
        var arrows = obj.find('.offer_arrow');

        arrows.on('click', function(){ switchSlide(items, $(this)); });
    });

    function switchSlide( items, arrow )
    {
        var current = items.filter('.current').index();
        var length = items.length;
        var next = 0;

        if(arrow.hasClass('prev')){
            next = current == 0 ? length - 1 : current - 1;
        } else {
            next = current + 1 == length ? 0 : current + 1;
        }

        items.removeClass('current').eq(next).addClass('current');
    }
}

function formSubmit( e )
{
    e.preventDefault();

    var form = $(this);
    var action = form.attr('id');
    var requireInput = {};

    var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

    switch(action){
        case 'request':
            requireInput = form.find('input[name="contacts"]');
            if(!requireInput.val()){
                requireInput.addClass('error');
                return false;
            }
            break;
        case 'subscribe':
            requireInput = form.find('input[name="email"]');
            if(!pattern.test(requireInput.val())){
                requireInput.addClass('error');
                return false;
            }
            break;
    }

    requireInput.removeClass('error');

    $.ajax({
        type: 'POST',
        url: '/handlers/send-mail.php',
        dataType: 'json',
        data: 'action=' + action + '&' + form.serialize(),
        complete: function(data) { form.addClass('sended'); }
    });

    return false;
}

function initSlides()
{
    var slides = $('.slide');
    var current = 0;
    var total = slides.length;
    var swipeAllowed = true;
    var tabSwitch = true;

    $('input[type="text"]').on('focus', inputFocus);

    $('.switcher_arrow').on('click', function(){ switchSlide($(this).hasClass('prev') ? 1 : -1); });
    slides.on('mousewheel', function(e){ switchSlide(e.deltaY); });
    $('.more').on('click', function(){ switchSlide(false); });

    function inputFocus()
    {
        var self = $(this);
        var slide = self.closest('.slide');

        if(!slide.hasClass('current')){
            $('.slide').removeClass('current');
            slide.addClass('current');

            current = slide.index();
        }
    }

    function switchSlide( side )
    {
        if(!swipeAllowed) return false;

        swipeAllowed = false;
        setTimeout(function(){ swipeAllowed = true; }, 1100);

        var next = !side ? 7 : current - (side < 0 ? -1 : 1);

        if(next >= 0 && next < total){
            if(next != 0){
                $('video')[0].pause();
            } else {
                $('video')[0].play();
            }
            
            slides.removeClass('prev-page').filter('.current').removeClass('current').addClass('prev-page');
            slides.eq(next).addClass('current');

            current = next;
        }
    }
}