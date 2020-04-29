<?php

foreach ( $versions as $num => $prod_url ) {
	// Don't need if already there
	if ( file_exists( "./json/dev/$num.json" ) ) {
		continue;
	}

	// Don't want -beta stuff
	if ( ( preg_match( "/[a-z]/i", $num ) && '7.8-beta' !== $num ) ){
		continue;
	}

	if ( strlen( $num ) === 3 ) {
		exec( "wget -O tmp/$num.zip https://github.com/Automattic/jetpack/archive/branch-$num.zip", $out, $return );

		if ( $return !== 0 ) {
			exec( "rm tmp/$num.zip" );
			continue;
		}

		$out = "./json/dev/{$num}.json";

		// Cloc the files
		echo "cloc files... \n";
		exec( "cloc --json --out='{$out}' ./tmp/$num.zip", $output );

		// Unzip and store in /tmp
		echo "unzip... \n";
		$zip = new ZipArchive;
		$res = $zip->open("./tmp/$num.zip" );
		if ( $res === TRUE ) {
			$zip->extractTo( "./tmp/$num" );
			$zip->close();
		}

		// Get the sizes
		echo "get sizes... \n";
		exec( "du -s ./tmp/$num.zip", $zipsize );
		$zipsize = explode( '	', $zipsize[0] )[0];

		exec( "du -s ./tmp/$num", $unzipsize );
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
	}
}

echo "Rebuilding all.json... \n";
$json_files = array_diff( scandir( './json/dev/' ), [ '.', '..', 'all.json' ] );
usort( $json_files, 'version_compare' );
$i = 0;
$fp = fopen( './json/dev/all.json', 'w' );
fwrite( $fp, '[' );
foreach ( $json_files as $file ) {
	$i++;
	if ( strlen( $file ) < 3 || 'all.json' == $file ) {
		continue;
	}
	$contents = file_get_contents( "json/dev/$file" );
	fwrite( $fp, $contents );

	if ( $i != count( $json_files ) ) {
		fwrite( $fp, ',' );
	}
}
fwrite( $fp, ']' );
fclose( $fp );
echo "All done for real! \n";
echo "<pre>";
//print_r( $versions );
echo "</pre>";