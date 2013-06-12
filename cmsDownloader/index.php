<?php
//
$cmsLocation = 'http://www.destinationnsw.com.au/smartphoneapps/south-coast';
// Connect
$db = new SQLite3('cmsPages.db');
// load a matrix feed
function loadJSON($url){
	$string = file_get_contents($url);
	$string = str_replace(' 	/', "/", $string);
	//echo $string. '<br>';
	$json_a=json_decode($string,true);
	//echo $json_a;
	return $json_a;
}
// execute a query
function excuteQuery($query){
	//echo $query;
	global $db;
	return $db->query($query);
}
// set up the database
excuteQuery('DROP TABLE Images');
excuteQuery('CREATE TABLE Images ( id INTEGER PRIMARY KEY, image_name varchar2(250) not null, alt_text varchar2(250))');
excuteQuery('DROP TABLE Pages');
excuteQuery('CREATE TABLE Pages ( id INTEGER PRIMARY KEY, name varchar2(250) not null, url varchar2(250)not null, date_modified int ,images TEXT,JSON_data TEXT)');
// save an image to the file syst
// add a image to the database
function addImage($imageName,$altText){
	// save the image
	$query = 'INSERT INTO Images (image_name,alt_text) VALUES ("'.$imageName.'","'.$altText.'")';
	$insertResult = excuteQuery($query);
	// find the image id from the database
	$sQuery = 'SELECT id FROM Images WHERE image_name = "'.$imageName.'"';
	$selectResult = excuteQuery($sQuery);
	$imageId;
	 while($res = $selectResult->fetchArray(SQLITE3_ASSOC)){ 
	 	$imageId = $res['id'];
	 }
	return $imageId;
}
// save an image to the file system
function saveImage($url,$imageName){
	$img = 'cms/'.$imageName;
	file_put_contents($img, file_get_contents($url));
}
// give a JSON link will save a product
function savePage($url){
	echo '<br>saveProduct: '.$url. '<br>';;
	//'http://www.visitnsw.com/widgets/mobile-app-platform-feeds/restaurant-details/_nocache?product=121bc-cantina-enoteca'
	// load the JSON file 
	$JSON = loadJSON($url);
		//echo json_encode($JSON);
	// process all of the images
	$imageIndex =0;
	$imagesIdList = '';
	if ($JSON['Page']['Images']){
		foreach ($JSON['Page']['Images'] as &$list) {
			$imagePath = $list["Full Size"];
			$altText = $list["Alt"];
			$pathBreakdown = explode('/', $imagePath);
		  	$imageName = $pathBreakdown[count($pathBreakdown)-2].'_'.$pathBreakdown[count($pathBreakdown)-1];
		  	echo '$imageName: '.$imageName. '<br>';;
		    $imageId = addImage($imageName,$altText);
		    if ($imageIndex!=0){
		 		$imagesIdList .= ',';
		    }
		    $imagesIdList .= $imageId;
		    saveImage($imagePath,$imageName);
		    $imageIndex++;
		    echo '<br>$imageIndex '.$imageIndex;
		}
	}
	$JSONString = json_encode($JSON);
	$JSONString  = str_replace("'","\u2019",$JSONString);
	echo '<br>Saving... '.$JSON['Page']['Title']. '<br>';
	$query = 'INSERT INTO Pages (name,url,date_modified,images,JSON_data) VALUES ("'.$JSON['Page']['Title'].'","'.$url.'",'.(time()*1000).',"'.$imagesIdList.'",\''.$JSONString .'\')';
	$pResult = excuteQuery($query);
	// process all of the pages childpages
	if ($JSON['Children']){
		foreach ($JSON['Children'] as &$chirdren) {
			savePage($chirdren["Url"]);
		}
	}
	
}

// start loading from the top of the cms tree
savePage($cmsLocation);
?>