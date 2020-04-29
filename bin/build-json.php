<?php
//defined( 'ABSPATH' ) or die();

//exit;

function jetpack_build_reports( $prod_or_dev ) {
	if ( empty( $prod_or_dev ) ) {
		die( "need to pass 'prod' or 'dev' param" );
	}
	$jetpack_info = json_decode( file_get_contents( 'http://api.wordpress.org/plugins/info/1.0/jetpack.json' ) );
	$versions = $jetpack_info->versions;

	foreach ( $versions as $num => $download_url ) {
		// Don't need if already there
		if ( file_exists( "./json/{$prod_or_dev}/$num.json" ) ) {
			continue;
		}

		// Don't want -beta stuff
		if ( ( preg_match( "/[a-z]/i", $num ) ) ){
			continue;
		}

		// Download the zip to /tmp
		echo "Download zip... \n";
		//	$num = 'trunk';
		exec( "curl https://downloads.wordpress.org/plugin/jetpack.{$num}.zip --create-dirs -o ./tmp/{$prod_or_dev}/$num.zip", $out, $return );

		$out = "./json/{$prod_or_dev}/{$num}.json";

		// Cloc the files
		echo "cloc files... \n";
		exec( "cloc --json --out='{$out}' ./tmp/{$prod_or_dev}/$num.zip", $output );

		// Unzip and store in /tmp
		echo "unzip... \n";
		$zip = new ZipArchive();
		$res = $zip->open("./tmp/{$prod_or_dev}/$num.zip" );
		if ( $res === TRUE ) {
			$zip->extractTo( "./tmp/{$prod_or_dev}/$num" );
			$zip->close();
		}

		// Get the sizes
		echo "get sizes... \n";
		exec( "du -s ./tmp/{$prod_or_dev}/$num.zip", $zipsize );
		$zipsize = explode( '	', $zipsize[0] )[0];

		exec( "du -s ./tmp/{$prod_or_dev}/$num", $unzipsize );
		$unzipsize = explode( '	', $unzipsize[0] )[0];

		// Add the sizes to json data
		echo "Add size to json... \n";
		$size_data = [
			'zipped' => $zipsize,
			'unzipped' => $unzipsize,
		];

		$inp = file_get_contents( $out );
		$tempArray = (array) json_decode( $inp );
		$tempArray['size'] = $size_data;
		$tempArray['header'] = [ 'version' => $num ];
		$jsonData = json_encode( $tempArray );
		file_put_contents( $out, $jsonData );

		echo "Done writing $out! \n";

		echo "cleaning up... \n";
		exec( "rm -rf ./tmp/{$prod_or_dev}/$num.zip" );
		exec( "rm -rf ./tmp/{$prod_or_dev}/$num" );

		echo "Done!\n";
	}


	echo "Rebuilding all.json... \n";
	$json_files = array_diff( scandir( "./json/{$prod_or_dev}/" ), [ '.', '..', 'all.json' ] );
	usort( $json_files, 'version_compare' );
	$i = 0;
	$fp = fopen( "./json/{$prod_or_dev}/all.json", 'w' );
	fwrite( $fp, '[' );
	foreach ( $json_files as $file ) {
		$i++;
		if ( strlen( $file ) < 3 || 'all.json' == $file ) {
			continue;
		}
		$contents = file_get_contents( "./json/{$prod_or_dev}/$file" );
		fwrite( $fp, $contents );

		if ( $i != count( $json_files ) ) {
			fwrite( $fp, ',' );
		}
	}
	fwrite( $fp, ']' );
	fclose( $fp );
	echo "All done for real! \n";
}

jetpack_build_reports( $argv[1] );



//$jetpack_info = json_decode( file_get_contents( 'http://api.wordpress.org/plugins/info/1.0/jetpack.json' ) );
//$all_versions = $jetpack_info->versions;
//
//$versions_to_download = [];
//foreach ( $all_versions as $num => $download_url ) {
//	// Don't want -beta stuff
//	if ( preg_match( "/[a-z]/i", $num ) ) {
//		continue;
//	}
//
//	$versions_to_download[ $num ] = $download_url;
//}
//
//print_r( $versions_to_download );
//
//exit;