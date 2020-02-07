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
	.candidate {
		margin: 1em;
	}
	.candidate .mug {
		width: 100px;
	}

	.candidate .results {
		display: inline-block;
	}

	p.lastUpdated {
		font-family: "Benton Sans", sans-serif;
		font-size: 12px;
		text-transform: uppercase;
		color: #888888;
		margin-top: 0;
		margin-bottom: 12px;
	}
</style>

{#each statewide_data as candidate, i}
	{#if i < 4}<div class="candidate">
		<img class="mug" src="img/avatar.jpg" alt="{candidate.last} photo"/>
		<div class="results">
			<h2>{candidate.first} {candidate.last}</h2>
			{#if candidate.winner == true}<div class="winner">&#10004; I won!</div>{/if}
			<div class="votecount">{intcomma(candidate.votecount)}</div>
			<div class="votepct">{Math.round(candidate.votepct * 100) }%</div>
		</div>
	</div>{/if}
{/each}
<p class="lastUpdated">Last change: {last_updated}</p>
