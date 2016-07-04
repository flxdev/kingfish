'use strict';

$(document).ready(function(){
	
	
	$('.child_container').siblings('a.parent').addClass('after');	
	
$(function() {
    $('.section_item').matchHeight();
	$('.articles-list.sections .item.iblock').matchHeight();
});	
	
	// tabs on contacts page
	
	$('.contacts_content .tabs').delegate('li:not(.cur)', 'click', function() {
        // И удалим у предыдущего
        $(this).addClass('cur').siblings().removeClass('cur')
            .parents('.contacts_content').find('ul.tabs_content li').hide()
            // Посчитаем по какому по счету табу мы кликнули
            // и откроем соотвествующий элемент
            .eq($(this).index()).fadeIn();
		initMapServ();
    })
	
	
	
	
});