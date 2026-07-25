const form = document.querySelector('#sleeper-form');
const username = document.querySelector('#sleeper-username');
const message = document.querySelector('#form-message');
const sleeperResults = document.querySelector('#sleeper-results');
const emptyState = document.querySelector('#empty-state');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = username.value.trim();
  const submit = form.querySelector('button');
  submit.disabled = true;
  sleeperResults.hidden = true;
  message.textContent = 'Looking up your Sleeper account…';
  try {
    const userResponse = await fetch(`https://api.sleeper.app/v1/user/${encodeURIComponent(value)}`);
    if (!userResponse.ok) throw new Error('User not found');
    const user = await userResponse.json();
    const stateResponse = await fetch('https://api.sleeper.app/v1/state/nfl');
    const state = stateResponse.ok ? await stateResponse.json() : {};
    const season = state.season || new Date().getFullYear();
    const leaguesResponse = await fetch(`https://api.sleeper.app/v1/user/${user.user_id}/leagues/nfl/${season}`);
    if (!leaguesResponse.ok) throw new Error('Leagues unavailable');
    const leagues = await leaguesResponse.json();
    message.textContent = `${leagues.length} current NFL league${leagues.length === 1 ? '' : 's'} found for ${user.display_name || user.username}.`;
    sleeperResults.innerHTML = leagues.length ? leagues.map((league) => `<article class="league-card"><strong>${escapeHtml(league.name || 'Untitled league')}</strong><p>NFL · ${escapeHtml(inferSleeperFormat(league))} · ${escapeHtml(league.status || 'unknown')} · ${escapeHtml(String(league.total_rosters || 0))} teams</p></article>`).join('') : '<p class="helper-text">No current NFL leagues were found for this account.</p>';
    sleeperResults.hidden = false;
    emptyState.hidden = true;
  } catch (error) {
    message.textContent = 'Unable to find that Sleeper account. Check the username and try again.';
  } finally {
    submit.disabled = false;
  }
});

const espnForm = document.querySelector('#espn-form');
const espnMessage = document.querySelector('#espn-message');
const espnResults = document.querySelector('#espn-results');

espnForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const espnUsername = document.querySelector('#espn-username').value.trim();
  const leagueId = document.querySelector('#espn-league-id').value.trim();
  const sport = document.querySelector('#espn-sport').value;
  const format = document.querySelector('#league-format').value;
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
    const profile = espnUsername ? ` · Linked to ${escapeHtml(espnUsername)}` : '';
    espnResults.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(sportLabel(sport))} · ${escapeHtml(format)} · ${teams.length} team${teams.length === 1 ? '' : 's'} · ${escapeHtml(String(seasonYear))} season · League ID ${escapeHtml(leagueId)}${profile}</p>`;
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

function sportLabel(code) {
  return ({ ffl: 'NFL', fba: 'NBA', flb: 'MLB' })[code] || code.toUpperCase();
}

function inferSleeperFormat(league) {
  const text = `${league.name || ''} ${JSON.stringify(league.metadata || {})}`.toLowerCase();
  if (text.includes('dynasty')) return 'Dynasty';
  if (text.includes('keeper')) return 'Keeper';
  return 'Redraft';
}
