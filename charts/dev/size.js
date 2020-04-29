/* global jQuery */
jQuery( document ).ready( function ( $ ) {

	// Timeline chart
	$.getJSON( "./json/dev/all.json", function( all ) {
		let labels = [],
			sizeZippedData = [],
			sizeUnzippedData = [];

		$.each( all, function( key, release ) {
			labels.push( release.header.version );
			sizeZippedData.push( release.size.zipped );
			sizeUnzippedData.push( release.size.unzipped );
		} );

		var pluginSize = document.getElementById( 'pluginSize-dev' ).getContext( '2d' );
		new Chart( pluginSize, {
			// The type of chart we want to create
			type: 'line',

			// The data for our dataset
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Zipped',
						borderColor: 'rgb(255, 99, 132)',
						data: sizeZippedData
					},
					{
						label: 'Unzipped',
						borderColor: 'rgb(255, 99, 132)',
						data: sizeUnzippedData
					}
				]
			},
			// Configuration options go here
			options: {}
		} );


		// Number of files
		let totalFiles = [],
			phpFiles = [],
			jsFiles = [],
			otherFiles = [],
			cssFiles = [];

		$.each( all, function( key, release ) {
			totalFiles.push( release.SUM.nFiles );
			phpFiles.push( release.PHP.nFiles );
			jsFiles.push( release.JavaScript.nFiles );
			cssFiles.push( release.CSS.nFiles );

			// The rest
			otherFiles.push( release.SUM.nFiles - release.PHP.nFiles - release.JavaScript.nFiles - release.CSS.nFiles );
		} );

		var numFiles = document.getElementById( 'numFiles-dev' ).getContext( '2d' );
		new Chart( numFiles, {
			// The type of chart we want to create
			type: 'line',

			// The data for our dataset
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Total Files',
						borderColor: 'green',
						data: totalFiles
					},
					{
						label: 'PHP',
						borderColor: '#8892be',
						data: phpFiles
					},
					{
						label: 'JS',
						borderColor: '#F0DB4F',
						data: jsFiles
					},
					{
						label: 'CSS',
						borderColor: 'blue',
						data: cssFiles
					},
					{
						label: 'Other',
						borderColor: '#eeeeee',
						data: otherFiles
					},
				]
			},
			// Configuration options go here
			options: {}
		} );


		// Lines of Code
		let totalLoC = [],
			phpLoC = [],
			jsLoC = [];

		$.each( all, function( key, release ) {
			totalLoC.push( release.SUM.code );
			phpLoC.push( release.PHP.code );
			jsLoC.push( release.JavaScript.code );
		} );

		var numLoC = document.getElementById( 'numLoC-dev' ).getContext( '2d' );
		new Chart( numLoC, {
			// The type of chart we want to create
			type: 'line',

			// The data for our dataset
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Total LoC',
						borderColor: 'rgb(255, 99, 132)',
						data: totalLoC
					},
					{
						label: 'PHP',
						borderColor: '#8892be',
						data: phpLoC
					},
					{
						label: 'JS',
						borderColor: '#F0DB4F',
						data: jsLoC
					},
				]
			},
			// Configuration options go here
			options: {}
		} );
	} );
} );