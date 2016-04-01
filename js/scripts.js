$(function() {
    var isMobile = is_touch_device() || $(window).width() <= 1024;

    if(isMobile) $('.body').addClass('mobile');

    $(window).load(function(){
        if(!isMobile) initSlides();
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

    slides.on('mousewheel', switchSlide);
    $('input[type="text"]').on('focus', inputFocus);



    function inputFocus()
    {
        console.log(2222);
        var self = $(this);
        var slide = self.closest('.slide');

        if(!slide.hasClass('current')){
            $('.slide').removeClass('current');
            slide.addClass('current');

            current = slide.index();
        }
    }

    function switchSlide( e )
    {
        if(!swipeAllowed) return false;
        swipeAllowed = false;
        setTimeout(function(){ swipeAllowed = true; }, 1500);

        var next = current - (e.deltaY < 0 ? -1 : 1);

        if(next >= 0 && next < total){
            if(next != 0){
                $('video')[0].pause();
            } else {
                $('video')[0].play();
            }
            slides.removeClass('current').eq(next).addClass('current');
            current = next;
        }
    }
}