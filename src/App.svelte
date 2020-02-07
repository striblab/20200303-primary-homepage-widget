<script>
	import { onMount } from 'svelte';
	import {intcomma} from 'journalize';

	let json = [];
	let statewide_data = [];
	let last_updated;
	const date_options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

	$ : {
		statewide_data = json.filter(function(d) {
      return d.level == "state";
    }).sort(function(a, b) {
			return b.votecount - a.votecount;
		});

		if (statewide_data.length > 0) {
			last_updated = new Date(statewide_data[0].lastupdated).toLocaleString('en-US', date_options)
		} else {
			last_updated = "Retrieving data..."
		}

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
	{#each statewide_data as candidate, i}
		{#if i < 4}
		<div class="candidate">
			<img class="mug" src="img/avatar.jpg" alt="{candidate.last} photo"/>
			<div class="results">
				<h2>{candidate.first} {candidate.last}</h2>
				<div class="votepct">
					{#if candidate.winner == true}
						<span class="winner">&#10004 {Math.round(candidate.votepct * 100) }%</span>
					{:else}
						{Math.round(candidate.votepct * 100) }%
					{/if}
				</div>
				<div class="votecount">Votes: {intcomma(candidate.votecount)}</div>
			</div>
		</div>{/if}
	{/each}
</div>
<p class="lastUpdated">Last updated: {last_updated}</p>
