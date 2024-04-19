function test(id) {
    let element = document.getElementById(id);
    let regex = /[^0-9]/gi;
    if (element.value.length > 4) {
        element.value = element.value.substring(0, 4);
    }
    element.value = element.value.replace(regex, "");
    displayData()
}

document.getElementById("team").addEventListener("keypress",(e) => {
    if (e.key === "Enter") displayData();
});

async function displayData() {
    let element = document.getElementById("team");
    let data = await fetchData(element.value);
    console.log(data);
    if(element.value == ""){
        document.getElementById("info").innerHTML = `Please provide a team number!`;
    }
    else if(data && data.Error){
        document.getElementById("info").innerHTML = `Error: Team does not exist!`;
    } else{
        document.getElementById("info").innerHTML = `Name: ${data.nickname ? data.nickname : "N/A"}<br><br>Team number: ${data.team_number ? data.team_number : "N/A"}<br><br>State: ${data.state_prov ? data.state_prov : "N/A"}<br><br>City: ${data.city ? data.city : "N/A"}<br><br>School name: ${data.school_name ? data.school_name : "N/A"}<br><br>Rookie year: ${data.rookie_year ? data.rookie_year : "N/A"}<br><br>Website: <a href="${data.website ? data.website : "N/A"}" target="_blank">${data.website ? data.website : "N/A"}</a>`;
    }
}

async function fetchData(team){
    const key_path = '../var/tba-read-key.json';
    const default_key = '2024mndu';
    const default_team = 'frc1732';
    const url_start = 'https://www.thebluealliance.com/api/v3/team/';
    const url_end = '?X-TBA-Auth-Key=';
    let key = "";
    async function load_read_key(){
        try{
            const response = await fetch(key_path);
            if (!response.ok) {
                throw new Error('Failed to fetch key file');
            }
            const jsonData = await response.json();
            key = jsonData.api_key;
        }
        catch(error){
            console.log('Could not open ' + key_path);
            console.error(error);
        }
    }
    async function getData(){
        await load_read_key();
        let response = ""
        while(!response.ok){
            try{
                response = await fetch(url_start + "frc" + team + url_end + key)
                return await response.json();
            }
            catch(error){
                console.log(error)
                return
            }
        }
    }
    return getData()
}