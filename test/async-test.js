const reposBtn = document.getElementById('search-btn');

reposBtn.onclick = eventClick

function eventClick() {
    const username = document.getElementById('username').value
    const userGet = `https://api.github.com/search/users?page=1&q=${username}&type=Users`

    list(userGet)
        .catch(e => console.error(e))
}

async function list(userGet = '') {
    const users = await request(userGet)
    const usersList = JSON.parse(users).items

    usersList.forEach(async function (user) {
        try {
            const repos = await request(user.repos_url)
            createListing(user, repos)
        } catch (e) {
            console.error(e)
        }
    })

    function createListing(user, repos) {
        const userRepos = JSON.parse(repos)

        const table = document.getElementById('results')
        const row = table.insertRow()
        const userCell = row.insertCell()
        const reposCell = row.insertCell()

        userCell.innerHTML = user.login
        userRepos.forEach(repo => {
            const link = createLink(repo.name, repo.git_url)
            reposCell.appendChild(link)
        })
    }
}

function createLink(name, link) {
    const a = document.createElement('a')
    a.setAttribute('href', link)
    a.innerHTML = `${name}<br />`
    console.log('eqweq', a)
    return a
}

function request(url) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }
        xhr.open('get', url, true)
        xhr.send()
    })
}
