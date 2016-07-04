if(document.getElementById('contacts_map')){
//	console.log('Map exist');
$(function (){})
    var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#4eccff"},{"visibility":"on"}]}];


var markers = [];
function initMap(){
	var myLatlng = new google.maps.LatLng(53.9324054,27.6489856); 
    var myOptions = {
        zoom: 15,
        center: new google.maps.LatLng(53.9324054, 27.6489856),
//        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_CENTER
            },
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
        }
    };
    var map = new google.maps.Map(document.getElementById('contacts_map'), myOptions);
    var mapType = new google.maps.StyledMapType(styles, { name:"Grayscale" });    
        map.mapTypes.set('tehgrayz', mapType);
        map.setMapTypeId('tehgrayz');
	var image = '../bitrix/images/pin.png';
//	var image = image = {
//        url   : '../bitrix/images/pin.png',
//        size  : new google.maps.Size(65, 70),
//        origin: new google.maps.Point(0, 0),
//        anchor: new google.maps.Point(32, 70)
//    };
	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		icon: image
	  });
	
        marker.setMap(map);
    
}
	
initMap();
		
}



function initMapServ(){
	if(!arguments.callee.once){
		if(document.getElementById('contacts_map_serv')){
//	console.log('Map exist1');
$(function (){})
    var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#4eccff"},{"visibility":"on"}]}];

var markers = [];
function initMap(){
	var myLatlng = new google.maps.LatLng(54.9324054,27.6489856); 
    var myOptions = {
        zoom: 15,
        center: new google.maps.LatLng(54.9324054, 27.6489856),
//        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_CENTER
            },
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
        }
    };
    var map = new google.maps.Map(document.getElementById('contacts_map_serv'), myOptions);
    var mapType = new google.maps.StyledMapType(styles, { name:"Grayscale" });    
        map.mapTypes.set('tehgrayz', mapType);
        map.setMapTypeId('tehgrayz');
	var image = '../bitrix/images/pin.png';

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		icon: image
	  });
	
        marker.setMap(map);
	 
}
		
initMap();
	
}
		arguments.callee.once = true;
	}
	
}

