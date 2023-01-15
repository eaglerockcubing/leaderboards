function parseDateMinutes(date) {
    if (date.getMinutes() < 10){
        return "0" + date.getMinutes().toString();
    } else return date.getMinutes().toString();
}

function getDateString(date) {
    const d = new Date(date);

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    const months = [
        'January',
        'February',
        'March',
        "April",
        "May",
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${d.getHours() > 12 ? d.getHours()-12 : d.getHours()}:${parseDateMinutes(d)} ${d.getHours() > 11 ? "PM" : "AM"}`;
}

function fetchLeaderboard(url, average) {
    fetch('../db/' + url)
    .then(res => res.json())
    .then(leaderboard => {
        // the last updated date
        document.querySelector('.last-updated').innerHTML = getDateString(leaderboard.last_updated);
        let leaderboardHTML = [];
        leaderboard.leaderboard.forEach((time, i) => {

            if (average) {
                leaderboardHTML.push(createRecordHTMLAverage(time, i + 1));
            } else {
                leaderboardHTML.push(createRecordHTMLSingle(time, i + 1));
            }
        
        });

        document.querySelector('tbody.leaderboard').innerHTML = leaderboardHTML.join('\n');

    })
}

function createRecordHTMLSingle(record, position) {
    return `<tr>
    <td class="pos">${position}</td>
    <td class="name">${record.name}</td>
    <td class="time">${record.time}</td>
    <td class="date">${record.date}</td>
    <td class="scramble">${record.scramble}</td>
    </tr>`;
}

function createRecordHTMLAverage(record, position) {
    let scrambles = [];

    record.solves.forEach((solve, i) => {
        // this line of code is way too long
        scrambles.push(`<p>${i+1}. ${solve.trimmed?'(':''}${solve.time}${solve.trimmed?')':''}: ${solve.scramble}</p>`);
    });

    return `<tr>
    <td class="pos">${position}</td>
    <td class="name">${record.name}</td>
    <td class="time">${record.time}</td>
    <td class="date">${record.date}</td>

    <td class="solve${record.solves[0].trimmed?' trimmed':''}">${record.solves[0].time}</td>
    <td class="solve${record.solves[1].trimmed?' trimmed':''}">${record.solves[1].time}</td>
    <td class="solve${record.solves[2].trimmed?' trimmed':''}">${record.solves[2].time}</td>
    <td class="solve${record.solves[3].trimmed?' trimmed':''}">${record.solves[3].time}</td>
    <td class="solve${record.solves[4].trimmed?' trimmed':''}">${record.solves[4].time}</td>

    <td><button onclick="showAlert('${record.name}\\'s ${record.time} Average of 5', \`${scrambles.join('')}\`)">View Scrambles</button></td>
    </tr>`;
}