const form = document.querySelector('#sleeper-form');
const username = document.querySelector('#sleeper-username');
const message = document.querySelector('#form-message');
form.addEventListener('submit', (event) => { event.preventDefault(); const value = username.value.trim(); message.textContent = `Ready to connect ${value}. Add the Sleeper sync service before enabling live league imports.`; });

const espnForm = document.querySelector('#espn-form');
const espnMessage = document.querySelector('#espn-message');
const espnResults = document.querySelector('#espn-results');

espnForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const leagueId = document.querySelector('#espn-league-id').value.trim();
  const sport = document.querySelector('#espn-sport').value;
  const season = document.querySelector('#espn-season').value.trim();
  const submit = espnForm.querySelector('button');
  const url = `https://fantasy.espn.com/apis/v3/games/${sport}/seasons/${season}/segments/0/leagues/${encodeURIComponent(leagueId)}?view=mTeam&view=mSettings&view=mStandings`;
  submit.disabled = true;
  espnResults.hidden = true;
  espnMessage.textContent = 'Importing public ESPN league…';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`ESPN returned ${response.status}`);
    const league = await response.json();
    const teams = Array.isArray(league.teams) ? league.teams : [];
    const name = league.settings?.name || league.name || 'ESPN fantasy league';
    const seasonYear = league.seasonId || season;
    espnMessage.textContent = 'League imported successfully.';
    espnResults.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${teams.length} team${teams.length === 1 ? '' : 's'} · ${escapeHtml(String(seasonYear))} season · League ID ${escapeHtml(leagueId)}</p>`;
    espnResults.hidden = false;
  } catch (error) {
    espnMessage.textContent = 'Unable to import that league. Confirm the ID, season, and that the league is public.';
  } finally {
    submit.disabled = false;
  }
});

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}
