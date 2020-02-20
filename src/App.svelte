<script>
	import { onMount } from 'svelte';
	import {intcomma} from 'journalize';

	let json = [];
	let statewide_data = [];
	let state_precincts_pct;
	const date_options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

	$ : {
		statewide_data = json.filter(function(d) {
      return d.level == "state";
    }).sort(function(a, b) {
			return b.votecount - a.votecount;
		});

		if (statewide_data.length == 0) {
			state_precincts_pct = '';
		}
		else {
			state_precincts_pct = statewide_data[0].precinctsreportingpct;
		}

		// if (statewide_data.length > 0) {
		// 	last_updated = new Date(statewide_data[0].lastupdated).toLocaleString('en-US', date_options)
		// } else {
		// 	last_updated = "Retrieving data..."
		// }

	}

	onMount(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    json = await response.json();
  });

	setInterval(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    json = await response.json();
  }, 15000);
</script>

<style>

</style>

<div id="widgetContainer">
	<div class="logo">
		<div class="text">
			<h3>ELECTION</h3>
			<a href="startribune.com">See full Minn. Primary results</a>
		</div>
		<img src="img/ELEX2020.svg" alt="Election 2020"/>
		<a class="rightLink" href="startribune.com">SEE FULL RESULTS</a>
	</div>


	<div class="candidateContainer">
		{#each statewide_data as candidate, i}
			{#if i < 4}
			<div class="candidate">
				<img class="mug" src="img/{candidate.last.toLowerCase()}.jpg" alt="{candidate.last} photo"/>
				<div class="results">
					<h2>{candidate.last}</h2>
					<div class="votepct">
						{#if candidate.winner == true}
							<span class="winner">&#10004 {Math.round(candidate.votepct * 1000) / 10 }%</span>
						{:else}
							{Math.round(candidate.votepct * 1000) / 10  }<span class="pct">%</span>
						{/if}
					</div>
					<div class="votecount">Votes: {intcomma(candidate.votecount)}</div>
				</div>
			</div>
			{/if}
		{/each}
	</div>

</div>
<p class="lastUpdated">{ Math.round(state_precincts_pct * 100) }% PRECINCTS REPORTING</p>
