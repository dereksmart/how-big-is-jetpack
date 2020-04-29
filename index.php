<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>-->
<script src="_inc/jquery/jquery.js"></script>
<h1>How big is Jetpack?</h1>
<div style="width: 100%;">
	<section class="section" id="overview">
		<div class="col-2">
			<h3>Production <span id="recent-version-prod"></span></h3>
			<ul id="overview-prod"></ul>
		</div>

		<div class="col-2">
			<h3>Dev <span id="recent-version-dev"></span></h3>
			<ul id="overview-dev"></ul>
		</div>
	</section>

	<strong>Compare to: </strong>
	<select name="compare-to" id="compare-to"></select>

	<section class="section" id="plugin-size">
		<h1>Plugin Size</h1>
		<div class="col-2">
			<h3>Production</h3>
			<canvas id="pluginSize"></canvas>
		</div>

		<div class="col-2">
			<h3>Dev (unbuilt)</h3>
			<canvas id="pluginSize-dev"></canvas>
		</div>
	</section>

	<section class="section" id="num-files">
		<h1>Number of Files</h1>
		<div class="col-2">
			<h3>Production</h3>
			<canvas id="numFiles"></canvas>
		</div>

		<div class="col-2">
			<h3>Dev (unbuilt)</h3>
			<canvas id="numFiles-dev"></canvas>
		</div>
	</section>

	<section class="section" id="lines-of-code">
		<h1>Lines of Code</h1>
		<div class="col-2">
			<h3>Production</h3>
			<canvas id="numLoC"></canvas>
		</div>

		<div class="col-2">
			<h3>Dev (unbuilt)</h3>
			<canvas id="numLoC-dev"></canvas>
		</div>
	</section>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
<script src="./charts/charts.js"></script>
<style>
	.col-2 {
		width: 50%;
		float: left;
	}

	.section {
		float: left;
		width: inherit;
	}
</style>
<!--<script src="_inc/node_modules/chart.js/dist/Chart.bundle.js"></script>-->