function test(id) {
    let element = document.getElementById(id);
    let regex = /[^0-9]/gi;
    if (element.value.length > 4) {
        element.value = element.value.substring(0, 4);
    }
    element.value = element.value.replace(regex, "");
}

async function displayData() {
    let element = document.getElementById("team");
    let response = await fetch(`./data/${element.value}.json`);
    if (response.status === 404) {
        document.getElementById("name").textContent = "Team doesn't exists!";
        document.getElementById("ready").textContent = ``;
    } else {
        let data = await response.json();
        document.getElementById("name").textContent = `Name: ${data.name}`;
        document.getElementById("ready").textContent = `Robot ready?: ${data.robot}`;
    }
    fetchData(element.value);
}

async function fetchData(team){
    const key_path = './var/tba-read-key.json';
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
                const jsonData = await response.json();
                console.log(jsonData)
                break
            }
            catch{
                console.log('TBA API busy, retrying...')
            }
        }
    }
    getData()
}