/* global jQuery */
jQuery( document ).ready( function ( $ ) {
	// Get available versions
	const allDevJSON = getSomething( './json/dev/all.json' ),
		allProdJSON = getSomething( './json/prod/all.json' );

	const defaultVersion = allDevJSON[0],
		defaultVersionNum = defaultVersion.header.version;

	// List available versions
	let availableVersions = [];
	$.each( allDevJSON, function( key, data ) {
		document.getElementById( 'compare-to' ).innerHTML += '<option value="'+data.header.version+'">'+data.header.version+'</option>';
		availableVersions.push( data.header.version );
	} );

	// Insert options to select
	document.getElementById( 'compare-to' ).value = defaultVersionNum;

	function getSelectedVersion() {
		return document.getElementById( 'compare-to' ).value;
	}
	const selectedVersion = getSelectedVersion();

	// Recent Version
	const recentDev = allDevJSON[ allDevJSON.length-1 ],
		recentProd = allProdJSON[ allProdJSON.length-1 ],
		recentVersionDev = recentDev.header.version,
		recentVersionProd = recentProd.header.version;

	document.getElementById( 'recent-version-dev' ).innerHTML = recentVersionDev;

	// Overview
	const recentDevOverview = document.getElementById( 'overview-dev' );

	// Size
	$.each( recentDev.size, function( key, data ) {
		recentDevOverview.innerHTML += '<li>' + key + ': ' + formatBytes( data ) + '</li>';
	} );

	// SUM
	$.each( recentDev.SUM, function( key, data ) {
		recentDevOverview.innerHTML += '<li>' + key + ': ' + addCommas( data ) + '</li>';
	} );

	document.getElementById( 'recent-version-prod' ).innerHTML = recentVersionProd;

	// Overview
	const recentProdOverview = document.getElementById( 'overview-prod' );
	// Size
	$.each( recentProd.size, function( key, data ) {
		recentProdOverview.innerHTML += '<li>' + key + ': ' + formatBytes( data ) + '</li>';
	} );

	// SUM
	$.each( recentProd.SUM, function( key, data ) {
		recentProdOverview.innerHTML += '<li>' + key + ': ' + addCommas( data ) + '</li>';
	} );

	/*
	Build Dev Charts
	 */
	buildDevCharts( allDevJSON, selectedVersion, recentVersionDev );
	buildProdCharts( allProdJSON, selectedVersion, recentVersionProd );

	// On compare select change
	$( '#compare-to' ).on( 'change', function() {
		buildDevCharts( allDevJSON, getSelectedVersion(), recentVersionDev );
		buildProdCharts( allProdJSON, getSelectedVersion(), recentVersionProd );
	} );

	function buildDevCharts( data, from, to ) {
		// Only get filtered labels/versions
		const filteredData = filterLabels( data, from, to );
		renderSizeChart( filteredData, 'pluginSize-dev' );
		renderNumFilesChart( filteredData, 'numFiles-dev' );
		renderLoCChart( filteredData, 'numLoC-dev' );
	}
	function buildProdCharts( data, from, to ) {
		// Only get filtered labels/versions
		const filteredData = filterLabels( data, from, to );
		renderSizeChart( filteredData, 'pluginSize' );
		renderNumFilesChart( filteredData, 'numFiles' );
		renderLoCChart( filteredData, 'numLoC' );
	}

	function renderLoCChart( data, target ) {
		const labels = data[ data.length - 1 ].labels;

		let totalLoC = [],
			phpLoC = [],
			jsLoC = [];

		$.each( data, function( key, release ) {
			if ( release.header ) {
				totalLoC.push( release.SUM.code );
				phpLoC.push( release.PHP.code );
				jsLoC.push( release.JavaScript.code );
			}
		} );

		var numLoC = document.getElementById( target ).getContext( '2d' );
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
	}

	function renderNumFilesChart( data, target ) {
		const labels = data[ data.length - 1 ].labels;
		// Number of files
		let totalFiles = [],
			phpFiles = [],
			jsFiles = [],
			otherFiles = [],
			cssFiles = [];

		$.each( data, function( key, release ) {
			if ( release.header ) {
				totalFiles.push( release.SUM.nFiles );
				phpFiles.push( release.PHP.nFiles );
				jsFiles.push( release.JavaScript.nFiles );
				cssFiles.push( release.CSS.nFiles );

				// The rest
				otherFiles.push( release.SUM.nFiles - release.PHP.nFiles - release.JavaScript.nFiles - release.CSS.nFiles );
			}
		} );

		var numFiles = document.getElementById( target ).getContext( '2d' );
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
	}

	function renderSizeChart( data, target ) {
		const labels = data[ data.length - 1 ].labels;
		let sizeZippedData = [],
			sizeUnzippedData = [];

		// Size chart
		$.each( data, function( key, release ) {
			if ( release.header ) {
				// Multiply by 512. du output saved in blocks of 512 bytes.
				sizeZippedData.push( release.size.zipped * 512 );
				sizeUnzippedData.push( release.size.unzipped * 512 );
			}
		} );

		const pluginSize = document.getElementById( target ).getContext( '2d' );
		new Chart( pluginSize, {
			// The type of chart we want to create
			type: 'line',

			// The data for our dataset
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Zipped',
						borderColor: 'red',
						data: sizeZippedData
					},
					{
						label: 'Unzipped',
						borderColor: 'orange',
						data: sizeUnzippedData
					}
				]
			},
			// Configuration options go here
			options: {}
		} );
	}

	function filterLabels( data, from, to ) {
		// Only get filtered labels/versions
		let labels = [];
		let filteredData = [];
		$.each( data, function( key, release ) {
			const versionNum = release.header.version;
			// from to filter
			if ( versionNum < from || versionNum > to ) {
				return;
			}
			
			if ( ! release.SUM ) {
				// Skip releases without proper SUM property
				// Sometimes this property is missing due to bad data
				// And breaks the whole page.
				return;
			}
			
			labels.push( versionNum );
			filteredData.push( release );
		} );

		filteredData.push( { labels: labels } );

		return filteredData;
	}

	function getSomething( url ) {
		var result = null;
		$.ajax( {
			async: false,
			url: url,
			dataType: "json",
			success: function( data ) {
				result = data;
			}
		} );
		return result;
	}


	function addCommas(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

	function formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		// custom cuz du default
		bytes = 512*bytes;
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
} );
