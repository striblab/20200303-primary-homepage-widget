<script>
	import { onMount } from 'svelte';
	import {intcomma} from 'journalize';
	import * as pym from 'pym.js';

	let json = [];
	let statewide_data = [];
	let state_precincts_pct;
	let top_five = [];
	let i;
	let backup_timer;
	let active_candidates = ['Biden', 'Bloomberg', 'Gabbard', 'Sanders', 'Warren']

	const date_options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

	let dropped_candidates = ['Bennet', 'Booker', 'Buttigieg', 'Castro', 'Delaney', 'Klobuchar', 'Patrick', 'Steyer', 'Williamson', 'Yang'];
	const dropped_asterisk = function (candidate) {
		if (dropped_candidates.includes(candidate)) {
			return '*';
		}
		return '';
	}

	$ : {
		statewide_data = json.filter(function(d) {
      return d.level == "state";
    }).sort(function(a, b) {
			return b.votecount - a.votecount;
		});

		if (statewide_data.length == 0) {
			state_precincts_pct = '';
			top_five = []
		}
		else {
			if (statewide_data[0].precinctsreporting === 0) {
				statewide_data.sort(function(a, b) {
					return a.last.localeCompare(b.last);
				})
				state_precincts_pct = statewide_data[0].precinctsreportingpct;
				for (i = 0; i < statewide_data.length; i++) {
					if (active_candidates.includes(statewide_data[i].last)) {
						top_five.push(statewide_data[i])
					}
					else {
						continue;
					}
				}
			}
			else {
				state_precincts_pct = statewide_data[0].precinctsreportingpct;
				top_five = statewide_data.slice(0,5);
				if (top_five.some(elem => elem.last === 'Uncommitted') && Math.round(state_precincts_pct * 100) < 50) {
					top_five = []
					for (i = 0; i < 6; i++) {
						if (statewide_data[i].last === 'Uncommitted') {
							continue;
						}
						else {
							top_five.push(statewide_data[i])
						}
					}
				}
				else {
					top_five = [];
					top_five = statewide_data.slice(0,5)
				}
			}

		}
	}



	let getData = async function() {
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");

		if (response.ok) {
			json = await response.json();
			return json;
		} else {
			backup_timer = setTimeout(getData, 5000);
			// data = [];  // Don't do this so you don't overwrite good results with a temporary 404
			return [];
		}
	}

	onMount(async function() {
    getData();
		pymChild.sendHeight();
  });

	setInterval(getData, 30000);

	var pymChild = new pym.Child({ polling: 500});

</script>

<style>

</style>
{#if json.length > 0}
<a class="wrapperLink" target="_top" href="http://www.startribune.com/minnesota-primary-results-live-presidential-2020-vote-election-president-county/567017141/">
<div id="widgetContainer">
	<div class="logo">
		<div class="text">
			<h3>ELECTION</h3>
			<a target="_top" href="http://www.startribune.com/minnesota-primary-results-live-presidential-2020-vote-election-president-county/567017141/">See Minnesota primary results</a>
		</div>
		<img src="https://static.startribune.com/news/projects/all/20200303-elex-results/build/img/ELEX2020.svg" alt="Election 2020"/>
		<a class="rightLink" target="_top" href="http://www.startribune.com/minnesota-primary-results-live-presidential-2020-vote-election-president-county/567017141/">SEE MINNESOTA RESULTS</a>
	</div>


	<div class="candidateContainer">
		{#each top_five as candidate, i}
			{#if top_five[0].winner == true}
				<div class="candidate">
					{#if candidate.last !== 'Uncommitted'}
					<img class="mug" src="img/{candidate.last.toLowerCase()}.jpg" alt="{candidate.last} photo"/>
					{:else}
					<span class="uncommitted"></span>
					{/if}
					<div class="results">
						{#if candidate.winner == true}
							<h2 class="winner">{candidate.last} &#10004</h2>
						{:else}
							<h2 class="no-winner">{candidate.last}{dropped_asterisk(candidate.last)}</h2>
						{/if}
						<div class="votepct">
							{#if candidate.winner == true}
								<span class="winner">{Math.round(candidate.votepct * 1000) / 10 }%</span>
							{:else}
								<span class="no-winner-pct">{Math.round(candidate.votepct * 1000) / 10  }<span class="pct">%</span></span>
							{/if}
						</div>
						<div class="votecount">Votes: {intcomma(candidate.votecount)}</div>
					</div>
				</div>
			{:else}
				<div class="candidate">
					{#if candidate.last !== 'Uncommitted'}
					<img class="mug" src="img/{candidate.last.toLowerCase()}.jpg" alt="{candidate.last} photo"/>
					{/if}
					<div class="results">
						<!-- {#if candidate.winner == true}
							<h2 class="winner">{candidate.last} &#10004</h2>
						{:else} -->
							<h2>{candidate.last}{dropped_asterisk(candidate.last)}</h2>
						<!-- {/if} -->
						<div class="votepct">
							<!-- {#if candidate.winner == true}
								<span class="winner">{Math.round(candidate.votepct * 1000) / 10 }%</span>
							{:else} -->
								<span class="no-winner">{Math.round(candidate.votepct * 1000) / 10  }<span class="pct">%</span></span>
							<!-- {/if} -->
						</div>
						<div class="votecount">Votes: {intcomma(candidate.votecount)}</div>
					</div>
				</div>
				{/if}
		{/each}
	</div>
</div>
	<p class="lastUpdated">{ Math.round(state_precincts_pct * 100) }% PRECINCTS REPORTING</p>
</a>
{/if}
