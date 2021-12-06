const baseUrl = "https://web-2-challenges.herokuapp.com"
document.getElementById("insertbtn").onclick = insert
const challengeNameInput = document.getElementById("challengeNameInput")
const challengeCourseInput = document.getElementById("challengeCourseInput")
const challengePointsInput = document.getElementById("challengePointsInput")
const loadChallengesBtn = document.getElementById("loadChallenges")
loadChallengesBtn.onclick = getAllChallenges
const editChallengeBtn = document.getElementById("editbtn")
editChallengeBtn.onclick = updateChallenge


async function insert(){
    let challengeName = challengeNameInput.value
    let challengeCourse = challengeCourseInput.value
    let challengePoints = challengePointsInput.value
    let body = {
        "name": challengeName,
        "points": challengePoints < 0 ? 0 : challengePoints,
        "course": challengeCourse
    }
    let result = await sendRequest("POST","/challenges",body)
    clearForm()
    await getAllChallenges()
    return result
}

function clearForm(){
    challengeNameInput.value = ""
    challengeCourseInput.value = ""
    challengePointsInput.value = ""
}

async function getAllChallenges(){
    let result = await sendRequest("GET","/challenges")
    addChallengesHtml(result)
}

async function sendRequest(type,endpoint,body){
    let response = await fetch(`${baseUrl}${endpoint}`,{
        method: type,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let result = await response.json()
    return result
}

function addChallengesHtml(challenges){
    let html = document.getElementById("challenges")
    html.innerHTML = ""
    for (let challenge of challenges){
        html.appendChild(createChallengeHtml(challenge))
    }
}

async function updateChallenge(){
    let editNameInput = document.getElementById("challengeNameInputEdit")
    let editCourseInput = document.getElementById("challengeCourseInputEdit")
    let editPointsInput = document.getElementById("challengePointsInputEdit")
    let challengeIdInput = document.getElementById("challengeId")

    let body = {
        "name": editNameInput.value,
        "points": editPointsInput.value < 0 ? 0 : editPointsInput.value,
        "course": editCourseInput.value
    }
    await sendRequest("PUT",`/challenges/${challengeIdInput.value}`,body)
    hideEditForm()
    getAllChallenges()
}

async function editChallenge(id){
    let challenge = await sendRequest("GET",`/challenges/${id}`)
    fillInEditForm(challenge)
}

async function deleteChallenge(id){
    await sendRequest("DELETE",`/challenges/${id}`)
    await getAllChallenges()
}

function hideEditForm(){
    let form = document.getElementById("editForm")
    form.style.display = "None"
}

function showEditForm(){
    let form = document.getElementById("editForm")
    form.style.display = "block"
}

function fillInEditForm(challenge){
    console.log(challenge)
    showEditForm()
    let editNameInput = document.getElementById("challengeNameInputEdit")
    let editCourseInput = document.getElementById("challengeCourseInputEdit")
    let editPointsInput = document.getElementById("challengePointsInputEdit")
    let challengeIdInput = document.getElementById("challengeId")

    challengeIdInput.value = challenge._id
    editNameInput.value = challenge.name
    editPointsInput.value = challenge.points
    editCourseInput.value = challenge.course
}

function createChallengeHtml(challenge){
    let container = document.createElement("div")
    let cardbody = document.createElement("div")
    let nameHtml = document.createElement("h3")
    let courseHtml = document.createElement("h4")
    let pointsHtml = document.createElement("p")
    let deleteIcon = document.createElement("i")
    let editIcon = document.createElement("i")
    let iconContainer = document.createElement("div")
    deleteIcon.classList = "far fa-trash-alt fa-2x delete"
    editIcon.classList = "far fa-edit fa-2x edit"
    editIcon.onclick = function(){
        editChallenge(challenge._id)
    }
    deleteIcon.onclick = function(){
        deleteChallenge(challenge._id)
    }
    iconContainer.appendChild(deleteIcon)
    iconContainer.appendChild(editIcon)
    let infoContainer = document.createElement("div")
    iconContainer.classList.add("icons")
    nameHtml.innerText = challenge.name
    courseHtml.innerText = challenge.course
    pointsHtml.innerText = challenge.points
    infoContainer.appendChild(nameHtml)
    infoContainer.appendChild(courseHtml)
    infoContainer.appendChild(pointsHtml)
    container.appendChild(infoContainer)
    container.appendChild(iconContainer)
    nameHtml.classList.add("card-title")
    courseHtml.classList.add("card-text")
    cardbody.appendChild(infoContainer)
    cardbody.appendChild(iconContainer)
    cardbody.classList.add("card-body")
    container.appendChild(cardbody)
    container.classList.add("card")
    return container
}