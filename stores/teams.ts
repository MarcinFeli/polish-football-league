import { defineStore } from 'pinia'
import { MatchResult } from '~/types/enums'
import type { Team, Match, FormattedMatch } from '~/types'

export const useTeamsStore = defineStore('teams', {
	state: () => ({
		teams: [] as Team[],
		allMatches: [] as Match[],
		isLoading: true,
		favoriteTeamId: null as number | null,
	}),
	getters: {
		favoriteTeam: (state): Team | null => {
			if (!state.favoriteTeamId || !state.teams.length) return null
			return state.teams.find(team => team.id === state.favoriteTeamId) || null
		},
		gamesPlayed: () => {
			return (team: Team): number => {
				return team.wins + team.draws + team.losses
			}
		},
		getTeamById: state => {
			return (id: number): Team | null => {
				return state.teams.find(team => team.id === id) || null
			}
		},
	},
	actions: {
		async fetchTeams() {
			this.isLoading = true
			const supabase = useSupabaseClient()

			try {
				const [teamsResponse, matchesResponse] = await Promise.all([
					supabase.from('teams').select('*'),
					supabase.from('matches').select('*'),
				])

				if (teamsResponse.error) throw teamsResponse.error
				if (matchesResponse.error) throw matchesResponse.error

				const teamsData: Team[] = teamsResponse.data.map(team => ({
					...team,
					keyPlayers: team.key_players,
				})) as Team[]

				const matchesData: Match[] = matchesResponse.data.map(match => ({
					...match,
					homeTeamId: match.home_team_id,
					awayTeamId: match.away_team_id,
					homeScore: match.home_score,
					awayScore: match.away_score,
				})) as Match[]

				this.allMatches = matchesData
				const teamsWithStats = this.calculateTeamStats(teamsData, this.allMatches)

				this.teams = teamsWithStats
				this.recalculateStats()
			} catch (error) {
				console.error('Error fetching data from Supabase:', error)
				this.teams = []
				this.allMatches = []
			} finally {
				this.isLoading = false
			}
		},
		async ensureTeamsLoaded() {
			if (!this.teams.length) {
				await this.fetchTeams()
			}
		},
		calculateTeamStats(teamsData: Team[], matches: Match[]): Team[] {
			const teamStats: Record<number, Team> = {}
			teamsData.forEach(team => {
				teamStats[team.id] = {
					...team,
					wins: 0,
					draws: 0,
					losses: 0,
					goalsFor: 0,
					goalsAgainst: 0,
					points: 0,
					recentForm: [],
				}
			})
			matches.forEach(match => {
				const homeTeam = teamStats[match.homeTeamId]
				const awayTeam = teamStats[match.awayTeamId]
				if (!homeTeam || !awayTeam) return

				homeTeam.goalsFor += match.homeScore
				homeTeam.goalsAgainst += match.awayScore
				awayTeam.goalsFor += match.awayScore
				awayTeam.goalsAgainst += match.homeScore

				if (match.homeScore > match.awayScore) {
					homeTeam.wins += 1
					homeTeam.points += 3
					homeTeam.recentForm.unshift(MatchResult.Win)
					awayTeam.losses += 1
					awayTeam.recentForm.unshift(MatchResult.Loss)
				} else if (match.homeScore < match.awayScore) {
					awayTeam.wins += 1
					awayTeam.points += 3
					awayTeam.recentForm.unshift(MatchResult.Win)
					homeTeam.losses += 1
					homeTeam.recentForm.unshift(MatchResult.Loss)
				} else {
					homeTeam.draws += 1
					homeTeam.points += 1
					homeTeam.recentForm.unshift(MatchResult.Draw)
					awayTeam.draws += 1
					awayTeam.points += 1
					awayTeam.recentForm.unshift(MatchResult.Draw)
				}
			})

			Object.values(teamStats).forEach(team => {
				team.recentForm = team.recentForm.slice(0, 5).reverse()
				team.points = team.wins * 3 + team.draws
			})
			return Object.values(teamStats)
		},
		getTeamMatches(teamId: number, limit: number | null = null): FormattedMatch[] {
			if (!teamId || this.allMatches.length === 0) return []

			const matches = this.allMatches.filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId)
			const sortedMatches = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			const limitedMatches = limit ? sortedMatches.slice(0, limit) : sortedMatches

			return limitedMatches.map(match => {
				const isHome = match.homeTeamId === teamId
				const homeTeamObj = this.teams.find(t => t.id === match.homeTeamId)
				const awayTeamObj = this.teams.find(t => t.id === match.awayTeamId)
				let result: MatchResult

				if (isHome) {
					result =
						match.homeScore > match.awayScore
							? MatchResult.Win
							: match.homeScore < match.awayScore
							? MatchResult.Loss
							: MatchResult.Draw
				} else {
					result =
						match.awayScore > match.homeScore
							? MatchResult.Win
							: match.awayScore < match.homeScore
							? MatchResult.Loss
							: MatchResult.Draw
				}

				return {
					id: match.id,
					date: match.date,
					homeTeam: homeTeamObj ? homeTeamObj.name : 'Unknown Team',
					awayTeam: awayTeamObj ? awayTeamObj.name : 'Unknown Team',
					homeScore: match.homeScore,
					awayScore: match.awayScore,
					result,
					isHome,
				} as FormattedMatch
			})
		},

		async updateMatchResult(matchId: number, homeScore: number, awayScore: number) {
			const supabase = useSupabaseClient()
			const { error } = await supabase
				.from('matches')
				.update({ home_score: homeScore, away_score: awayScore })
				.eq('id', matchId)

			if (error) {
				console.error('Error updating match result:', error)
				return 
			}

			const matchIndex = this.allMatches.findIndex(m => m.id === matchId)
			if (matchIndex === -1) return

			this.allMatches[matchIndex].homeScore = homeScore
			this.allMatches[matchIndex].awayScore = awayScore

			this.recalculateStats()
		},

		async addNewMatch(match: Omit<Match, 'id'>) {
			const supabase = useSupabaseClient()

			const { data, error } = await supabase
				.from('matches')
				.insert({
					date: match.date,
					home_team_id: match.homeTeamId,
					away_team_id: match.awayTeamId,
					home_score: match.homeScore,
					away_score: match.awayScore,
				})
				.select()
				.single()

			if (error || !data) {
				console.error('Error adding new match:', error)
				return
			}

			const newMatch: Match = {
				id: data.id,
				date: data.date,
				homeTeamId: data.home_team_id,
				awayTeamId: data.away_team_id,
				homeScore: data.home_score,
				awayScore: data.away_score,
			}

			this.allMatches.push(newMatch)
			this.recalculateStats()
		},
		recalculateStats() {
			const teamsData = this.teams.map(team => ({
				...team,
				points: 0,
				wins: 0,
				draws: 0,
				losses: 0,
				goalsFor: 0,
				goalsAgainst: 0,
				recentForm: [],
			}))

			const teamsWithStats = this.calculateTeamStats(teamsData, this.allMatches)
			const sortedTeams = [...teamsWithStats].sort((a, b) => {
				if (b.points !== a.points) return b.points - a.points

				const aGoalDiff = a.goalsFor - a.goalsAgainst
				const bGoalDiff = b.goalsFor - b.goalsAgainst
				if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff

				if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor

				return a.name.localeCompare(b.name)
			})

			sortedTeams.forEach((team, index) => {
				team.position = index + 1
			})

			this.teams = sortedTeams
		},
		async updateTeamDetails(teamId: number, coach: string, stadium: string) {
			const supabase = useSupabaseClient()
			const { error } = await supabase.from('teams').update({ coach, stadium }).eq('id', teamId)

			if (error) {
				console.error('Error updating team details:', error)
				return
			}

			const teamIndex = this.teams.findIndex(t => t.id === teamId)
			if (teamIndex === -1) return

			this.teams[teamIndex].coach = coach
			this.teams[teamIndex].stadium = stadium
		},

		async deleteMatch(matchId: number) {
			const supabase = useSupabaseClient()
			const { error } = await supabase.from('matches').delete().eq('id', matchId)

			if (error) {
				console.error('Error deleting match:', error)
				return
			}

			this.allMatches = this.allMatches.filter(match => match.id !== matchId)

			this.recalculateStats()
		},

		setFavoriteTeam(teamId: number | null) {
			this.favoriteTeamId = teamId
			if (teamId) {
				localStorage.setItem('favoriteTeamId', teamId.toString())
			} else {
				localStorage.removeItem('favoriteTeamId')
			}
		},
		loadFavoriteTeam() {
			const savedFavoriteTeamId = localStorage.getItem('favoriteTeamId')
			if (savedFavoriteTeamId) {
				this.favoriteTeamId = parseInt(savedFavoriteTeamId)
			}
		},
	},
})
