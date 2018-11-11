$(function() {

/* Зміна фонової картинки в першій секції*/
var imgHead = [
  'img/header_fon_1.jpg',
  'img/header_fon_2.jpg',
], i=1;
function csaHead(){

  if(i > (imgHead.length-1)){
    $('header').animate({'opacity':'0'},200,function(){
      i=1;
      $('header').css({'backgroundImage':'url('+imgHead[0]+')'});
    });
    $('header').animate({'opacity':'1'},200);
  }else{
    $('header').animate({'opacity':'0'},200,function(){
      $('header').css({'backgroundImage':'url('+imgHead[i]+')'});
      i++;
    });
    $('header').animate({'opacity':'1'},200);
  }
}
var intervalCsaHead = setInterval(csaHead,5000);

/* Модальне вікно */
$(function () {
	$('.popup-modal').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#username',
		modal: true
	});
	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
});

	
});