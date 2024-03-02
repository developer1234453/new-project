const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')

const app = express()

app.use(express.json())
const db = null

const initilazationGBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initilazationGBAndServer()

const convertDbObjectToResponseObject = dpObject => {
  return {
    playerId: dpObject.player_id,
    playerName: dpObject.player_name,
    jerseyNumber: dpObject.jersey_number,
    role: dpObject.role,
  }
}
app.get('/players/', async (request, response) => {
  const getplayersQuery = `
    SELECT 
    * 
    FROM 
    cricket_team;`
  const playerarray = await db.all(getplayersQuery)
  response.send(
    playerarray.map(eachplayer => convertDbObjectToResponseObject(eachplayer)),
  )
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getplayerQuery = `
     SELECT 
     * 
      FROM 
      cricket_team
       WHERE 
       player_id = ${playerId};  `
  const player = await db.get(getplayerQuery)
  response.send(convertDbObjectToResponseObject(player))
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const postplayerQuery = `
    INSERT INTO 
    cricket_team (player_name,jersey_numbe, role) 
    VALUES ("${playerName}" ${jerseyNumber} "${role}");`
  const player = await db.run(postplayerQuery)
  response.send('player added to Team')
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params
  const updateplayerQuery = `
    UPDATE cricket_team 
    SET 
   player_name = "${playerName}",
   jersey_numbe = ${jerseyNumber},
   role = "${role}"
   WHERE player_id = ${playerId};`
  await db.run(updateplayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteplayerqyery = `
    DELETE FROM cricket_team
     WHERE
     player_id = ${playerId};`
  await db.run(deleteplayerqyery)
  response.send('Player Removed')
})
module.exports = app
